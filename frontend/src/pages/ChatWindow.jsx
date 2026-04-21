import { useState, useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../components/common/DashboardLayout';

const ENDPOINT = 'http://localhost:5000';
let socket;

const normalizeId = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value._id) return value._id.toString();
  return null;
};

const ChatWindow = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeListingId = queryParams.get('listingId');
  const receiverId = queryParams.get('sellerId');

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const { data } = await axios.get('/api/messages/conversations');
      setConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load conversations', error);
    }
  };

  const fetchMessages = async (listingId, otherUserId) => {
    if (!listingId || !otherUserId) return;

    try {
      setIsLoadingMessages(true);
      const { data } = await axios.get(`/api/messages/${listingId}?userId=${otherUserId}`);
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load messages', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Initialize socket once user is available
  useEffect(() => {
    if (!user?._id) return;

    socket = io(ENDPOINT);
    socket.emit('setup', user);

    socket.on('message received', (incomingMessage) => {
      const selectedListing = normalizeId(selectedConversation?.listing?._id);
      const selectedOtherUser = normalizeId(selectedConversation?.otherUser?._id);
      const incomingListing = normalizeId(incomingMessage.listing);
      const incomingSender = normalizeId(incomingMessage.sender);

      if (incomingListing === selectedListing && incomingSender === selectedOtherUser) {
        setMessages((prev) => [...prev, incomingMessage]);
      }

      fetchConversations();
    });

    return () => {
      socket.disconnect();
    };
  }, [user?._id, selectedConversation]);

  // Load conversation list on open
  useEffect(() => {
    if (!user?._id) return;
    fetchConversations();
  }, [user?._id]);

  // If coming from "Contact Seller", preselect that thread
  useEffect(() => {
    if (!activeListingId || !receiverId) return;

    const matchingConversation = conversations.find(
      (item) =>
        normalizeId(item?.listing?._id) === activeListingId
        && normalizeId(item?.otherUser?._id) === receiverId
    );

    if (matchingConversation) {
      setSelectedConversation(matchingConversation);
      return;
    }

    setSelectedConversation({
      listing: { _id: activeListingId, title: 'Listing Chat' },
      otherUser: { _id: receiverId, name: 'Seller' },
      firstMessageDirection: 'sent',
      lastMessage: null,
      updatedAt: new Date().toISOString(),
    });
  }, [activeListingId, receiverId, conversations]);

  // Load message history whenever selected conversation changes
  useEffect(() => {
    const listingId = normalizeId(selectedConversation?.listing?._id);
    const otherUserId = normalizeId(selectedConversation?.otherUser?._id);

    if (!listingId || !otherUserId) {
      setMessages([]);
      return;
    }

    socket?.emit('join chat', listingId);
    fetchMessages(listingId, otherUserId);
  }, [selectedConversation]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const listingId = normalizeId(selectedConversation?.listing?._id);
    const otherUserId = normalizeId(selectedConversation?.otherUser?._id);

    if (!newMessage.trim() || !listingId || !otherUserId) return;

    try {
      const { data } = await axios.post('/api/messages', {
        listingId,
        receiverId: otherUserId,
        content: newMessage,
      });

      socket.emit('new message', data);
      setMessages((prev) => [...prev, data]);
      setNewMessage('');
      fetchConversations();
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  const sentConversations = conversations.filter((item) => item.firstMessageDirection === 'sent');
  const receivedConversations = conversations.filter((item) => item.firstMessageDirection === 'received');

  const renderConversationButton = (item) => {
    const listingId = normalizeId(item?.listing?._id);
    const otherUserId = normalizeId(item?.otherUser?._id);
    const key = `${listingId}_${otherUserId}`;
    const isActive =
      normalizeId(selectedConversation?.listing?._id) === listingId
      && normalizeId(selectedConversation?.otherUser?._id) === otherUserId;

    return (
      <button
        key={key}
        type="button"
        onClick={() => setSelectedConversation(item)}
        className={`w-full text-left p-3 rounded-xl border transition-all ${
          isActive
            ? 'border-brand-accent bg-brand-accent/10'
            : 'border-gray-200 bg-white/70 hover:bg-white'
        }`}
      >
        <p className="text-sm font-semibold line-clamp-1">{item?.otherUser?.name || 'User'}</p>
        <p className="text-xs text-gray-500 line-clamp-1">{item?.listing?.title || 'Listing'}</p>
        <p className="text-xs text-gray-500 line-clamp-1 mt-1">{item?.lastMessage?.content || 'Open chat'}</p>
      </button>
    );
  };

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 rounded-[2rem] glass-light overflow-hidden mt-4 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <aside className="border border-gray-200 rounded-2xl p-4 overflow-y-auto custom-scrollbar bg-white/45">
          <h2 className="text-xl font-bold mb-4">Chats</h2>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Sent</h3>
            <div className="space-y-2">
              {sentConversations.length === 0 ? (
                <p className="text-sm text-gray-500">No sent chats yet.</p>
              ) : (
                sentConversations.map(renderConversationButton)
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Received</h3>
            <div className="space-y-2">
              {receivedConversations.length === 0 ? (
                <p className="text-sm text-gray-500">No received chats yet.</p>
              ) : (
                receivedConversations.map(renderConversationButton)
              )}
            </div>
          </div>
        </aside>

        {!selectedConversation ? (
          <div className="flex items-center justify-center text-gray-500 border border-gray-200 rounded-2xl bg-white/35">
            <div className="text-center p-8">
              <span className="text-5xl mb-4 block opacity-50">💬</span>
              <p>Select a chat to view old messages and send follow-ups.</p>
            </div>
          </div>
        ) : (
          <section className="flex flex-col border border-gray-200 rounded-2xl bg-white/35 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 bg-white/60">
              <h2 className="text-lg font-bold line-clamp-1">{selectedConversation?.otherUser?.name || 'Chat'}</h2>
              <p className="text-sm text-gray-500 line-clamp-1">{selectedConversation?.listing?.title || 'Listing'}</p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
              {isLoadingMessages && <p className="text-sm text-gray-500">Loading chat...</p>}

              {messages.map((msg) => {
                const messageSenderId = normalizeId(msg.sender);
                const isMe = messageSenderId === user._id;
                return (
                  <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] px-5 py-3 rounded-2xl ${
                        isMe
                          ? 'bg-brand-accent text-gray-900 rounded-br-sm'
                          : 'bg-white/60 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-xs opacity-70 mb-1 font-bold">{msg?.sender?.name || 'User'}</p>
                      <p className="leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="mt-4 flex gap-3 px-4 pb-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-5 py-4 rounded-2xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
              />
              <button
                type="submit"
                className="px-8 py-4 font-bold rounded-2xl bg-gray-900 text-white hover:scale-[1.02] transition-transform"
              >
                Send
              </button>
            </form>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ChatWindow;

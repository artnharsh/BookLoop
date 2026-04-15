import { useState, useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../components/common/DashboardLayout';

const ENDPOINT = 'http://localhost:5000';
let socket;

const ChatWindow = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeListingId = queryParams.get('listingId');
  const receiverId = queryParams.get('sellerId');

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize Socket
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    
    if (activeListingId) {
      socket.emit('join chat', activeListingId);
    }

    return () => {
      socket.disconnect();
    };
  }, [user, activeListingId]);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeListingId) return;
      try {
        const { data } = await axios.get(`/api/messages/${activeListingId}`);
        setMessages(data);
        socket.emit('join chat', activeListingId);
      } catch (error) {
        console.error('Failed to load messages');
      }
    };
    fetchMessages();
  }, [activeListingId]);

  // Listen for new incoming messages
  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if (activeListingId !== newMessageReceived.listing) {
        // Here you could show a notification if the message is for a different chat
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeListingId || !receiverId) return;

    try {
      const { data } = await axios.post('/api/messages', {
        listingId: activeListingId,
        receiverId: receiverId,
        content: newMessage
      });
      
      socket.emit('new message', data);
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col p-6 rounded-[2rem] glass-light dark:glass-dark overflow-hidden mt-4">
        <h2 className="text-2xl font-bold mb-4 px-4">Messages</h2>
        
        {!activeListingId ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <span className="text-5xl mb-4 block opacity-50">💬</span>
              <p>Select "Contact Seller" on a listing to start chatting.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat History Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
              {messages.map((msg, index) => {
                const isMe = msg.sender._id === user._id;
                return (
                  <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-5 py-3 rounded-2xl ${
                      isMe 
                        ? 'bg-brand-accent text-gray-900 rounded-br-sm' 
                        : 'bg-white/50 dark:bg-white/10 rounded-bl-sm'
                    }`}>
                      <p className="text-xs opacity-70 mb-1 font-bold">{msg.sender.name}</p>
                      <p className="leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="mt-4 flex gap-3 px-4 pb-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-5 py-4 rounded-2xl bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
              />
              <button 
                type="submit"
                className="px-8 py-4 font-bold rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:scale-[1.02] transition-transform"
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ChatWindow;
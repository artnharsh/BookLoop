const Message = require('../models/Message');

/**
 * @desc    Get conversation list for current user
 * @route   GET /api/messages/conversations
 * @access  Private
 */
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .populate('listing', 'title images price courseCode')
      .sort({ createdAt: 1 });

    const conversationMap = new Map();

    messages.forEach((msg) => {
      if (!msg.listing || !msg.sender || !msg.receiver) {
        return;
      }

      const senderId = msg.sender._id.toString();
      const receiverId = msg.receiver._id.toString();
      const otherUser = senderId === userId ? msg.receiver : msg.sender;
      const key = `${msg.listing._id.toString()}_${otherUser._id.toString()}`;

      if (!conversationMap.has(key)) {
        conversationMap.set(key, {
          listing: msg.listing,
          otherUser,
          firstMessageDirection: senderId === userId ? 'sent' : 'received',
          lastMessage: msg,
          updatedAt: msg.createdAt,
        });
      } else {
        const existing = conversationMap.get(key);
        existing.lastMessage = msg;
        existing.updatedAt = msg.createdAt;
        conversationMap.set(key, existing);
      }
    });

    const conversations = Array.from(conversationMap.values()).sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
};

/**
 * @desc    Send a new message
 * @route   POST /api/messages
 * @access  Private
 */
const sendMessage = async (req, res) => {
  try {
    const { listingId, receiverId, content } = req.body;

    if (!listingId || !receiverId || !content) {
      return res.status(400).json({ message: 'Invalid message data passed into request' });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      listing: listingId,
      content
    });

    // Populate sender and receiver details before sending back
    await message.populate('sender', 'name');
    await message.populate('receiver', 'name');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

/**
 * @desc    Fetch all messages for a specific listing transaction
 * @route   GET /api/messages/:listingId
 * @access  Private
 */
const getMessages = async (req, res) => {
  try {
    const { userId } = req.query;
    const baseQuery = {
      listing: req.params.listingId,
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    };

    if (userId) {
      baseQuery.$and = [
        {
          $or: [
            { sender: req.user._id, receiver: userId },
            { sender: userId, receiver: req.user._id }
          ]
        }
      ];
    }

    const messages = await Message.find(baseQuery)
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .sort({ createdAt: 1 }); // Oldest first for chat UI

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

module.exports = { sendMessage, getMessages, getConversations };
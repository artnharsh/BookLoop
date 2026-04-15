const Message = require('../models/Message');

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
    // Find messages where the current listing is matched, 
    // AND the current user is either the sender OR the receiver
    const messages = await Message.find({
      listing: req.params.listingId,
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .sort({ createdAt: 1 }); // Oldest first for chat UI

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

module.exports = { sendMessage, getMessages };
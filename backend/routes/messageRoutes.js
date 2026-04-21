const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { sendMessage, getMessages, getConversations } = require('../controllers/messageController');

router.route('/').post(protect, sendMessage);
router.route('/conversations').get(protect, getConversations);
router.route('/:listingId').get(protect, getMessages);

module.exports = router;
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { sendMessage, getMessages } = require('../controllers/messageController');

router.route('/').post(protect, sendMessage);
router.route('/:listingId').get(protect, getMessages);

module.exports = router;
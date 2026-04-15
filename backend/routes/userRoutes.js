const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  rateUser
} = require('../controllers/userController');

// Wishlist Routes
router.route('/wishlist')
  .get(protect, getWishlist);
  
router.route('/wishlist/:listingId')
  .post(protect, addToWishlist)
  .delete(protect, removeFromWishlist);

// Rating Route
router.post('/rate', protect, rateUser);

module.exports = router;
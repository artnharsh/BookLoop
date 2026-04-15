const User = require('../models/User');
const Rating = require('../models/Rating');
const Listing = require('../models/Listing');

/**
 * @desc    Add listing to wishlist
 * @route   POST /api/users/wishlist/:listingId
 * @access  Private
 */
const addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const listingId = req.params.listingId;

    // Check if listing exists
    const listingExists = await Listing.findById(listingId);
    if (!listingExists) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if already in wishlist
    if (user.wishlist.includes(listingId)) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    user.wishlist.push(listingId);
    await user.save();

    res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Remove listing from wishlist
 * @route   DELETE /api/users/wishlist/:listingId
 * @access  Private
 */
const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.listingId
    );
    
    await user.save();

    res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get user's wishlist
 * @route   GET /api/users/wishlist
 * @access  Private
 */
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: { path: 'seller', select: 'name' }
    });

    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Rate a seller
 * @route   POST /api/users/rate
 * @access  Private
 */
const rateUser = async (req, res) => {
  try {
    const { listingId, sellerId, score, comment } = req.body;
    const raterId = req.user._id;

    if (raterId.toString() === sellerId) {
      return res.status(400).json({ message: 'You cannot rate yourself' });
    }

    // Check if rating already exists to prevent duplicate ratings
    const existingRating = await Rating.findOne({ listing: listingId, rater: raterId });
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this transaction' });
    }

    // Create the rating
    const rating = await Rating.create({
      listing: listingId,
      rater: raterId,
      seller: sellerId,
      score: Number(score),
      comment
    });

    // Calculate new average rating for the seller
    const allSellerRatings = await Rating.find({ seller: sellerId });
    const totalScore = allSellerRatings.reduce((acc, curr) => acc + curr.score, 0);
    const newAverage = totalScore / allSellerRatings.length;

    // Update the seller's profile with the new average
    await User.findByIdAndUpdate(sellerId, { averageRating: newAverage.toFixed(1) });

    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  rateUser
};
const User = require('../models/User');
const Listing = require('../models/Listing');
const Message = require('../models/Message');

/**
 * @desc    Get platform analytics
 * @route   GET /api/admin/analytics
 * @access  Private/Admin
 */
const getPlatformAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const activeListings = await Listing.countDocuments({ status: 'Active' });
    const soldListings = await Listing.countDocuments({ status: 'Sold' });
    const totalMessages = await Message.countDocuments();

    // Calculate approximate savings (assuming an average saving of ₹500 per sold book)
    const estimatedSavings = soldListings * 500;

    res.json({
      totalUsers,
      activeListings,
      soldListings,
      totalMessages,
      estimatedPlatformSavings: `₹${estimatedSavings}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};

/**
 * @desc    Get all users for moderation
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

/**
 * @desc    Delete a user (Moderation)
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot delete other admin accounts' });
      }
      
      // Optional: Delete all listings associated with this user
      await Listing.deleteMany({ seller: user._id });
      await user.deleteOne();
      
      res.json({ message: 'User and their listings removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

module.exports = {
  getPlatformAnalytics,
  getAllUsers,
  deleteUser
};
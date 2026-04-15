const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');
const {
  getPlatformAnalytics,
  getAllUsers,
  deleteUser
} = require('../controllers/adminController');

// All routes here require both protect AND admin middlewares
router.route('/analytics').get(protect, admin, getPlatformAnalytics);
router.route('/users').get(protect, admin, getAllUsers);
router.route('/users/:id').delete(protect, admin, deleteUser);

module.exports = router;
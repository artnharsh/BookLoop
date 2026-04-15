const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing
} = require('../controllers/listingController');

// Public routes (anyone can view listings)
router.route('/').get(getListings);
router.route('/:id').get(getListingById);

// Protected routes (must be logged in)
// The upload.array('images', 3) allows up to 3 images to be uploaded at once under the field name 'images'
router.route('/').post(protect, upload.array('images', 3), createListing);
router.route('/:id').put(protect, updateListing);
router.route('/:id').delete(protect, deleteListing);

module.exports = router;
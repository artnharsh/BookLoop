const Listing = require('../models/Listing');

/**
 * @desc    Get all active listings
 * @route   GET /api/listings
 * @access  Public
 */
const getListings = async (req, res) => {
  try {
    const query = { status: 'Active' };

    // 1. Keyword Search (Matches Title or Author)
    if (req.query.keyword) {
      query.$or = [
        { title: { $regex: req.query.keyword, $options: 'i' } }, // 'i' makes it case-insensitive
        { author: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    // 2. Course Code Filter
    if (req.query.courseCode) {
      query.courseCode = { $regex: req.query.courseCode, $options: 'i' };
    }

    // 3. Condition Filter (Exact match)
    if (req.query.condition) {
      query.condition = req.query.condition;
    }

    // 4. Price Range Filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    const listings = await Listing.find(query)
      .populate('seller', 'name college averageRating')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listings', error: error.message });
  }
};
/**
 * @desc    Get single listing by ID
 * @route   GET /api/listings/:id
 * @access  Public
 */
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('seller', 'name college email');

    if (listing) {
      res.json(listing);
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listing', error: error.message });
  }
};

/**
 * @desc    Create a new listing
 * @route   POST /api/listings
 * @access  Private
 */
const createListing = async (req, res) => {
  try {
    const { title, author, edition, courseCode, price, condition } = req.body;

    // Get uploaded image paths
    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const listing = await Listing.create({
      seller: req.user._id, // Comes from the authMiddleware
      title,
      author,
      edition,
      courseCode,
      price,
      condition,
      images: imagePaths
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Error creating listing', error: error.message });
  }
};

/**
 * @desc    Update a listing
 * @route   PUT /api/listings/:id
 * @access  Private
 */
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Ensure the user updating the listing is the seller (or an admin)
    if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this listing' });
    }

    // Update fields
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body, // Pass new data
      { new: true, runValidators: true }
    );

    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: 'Error updating listing', error: error.message });
  }
};

/**
 * @desc    Delete a listing
 * @route   DELETE /api/listings/:id
 * @access  Private
 */
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Ensure the user deleting the listing is the seller or an admin
    if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this listing' });
    }

    await listing.deleteOne();
    res.json({ message: 'Listing removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting listing', error: error.message });
  }
};

module.exports = {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing
};
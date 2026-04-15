const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a book title'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please add the author']
  },
  edition: {
    type: String,
  },
  courseCode: {
    type: String,
    required: [true, 'Please add a related course code (e.g., CS101)'],
    trim: true,
    uppercase: true
  },
  price: {
    type: Number,
    required: [true, 'Please add a price. Enter 0 for donation.']
  },
  condition: {
    type: String,
    required: [true, 'Please specify condition'],
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
  },
  images: {
    type: [String], // Array of image URLs/paths
    default: []
  },
  status: {
    type: String,
    enum: ['Active', 'Sold', 'Pending'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
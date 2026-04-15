const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  rater: { // The buyer
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: { // The person being rated
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: [true, 'Please provide a rating score'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Prevent a user from rating the same transaction twice
ratingSchema.index({ listing: 1, rater: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
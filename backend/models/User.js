const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add a college email address'],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(org|[a-zA-Z]{2,})$/, // Basic email regex; you can refine this to match your college domain later
      'Please use a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false // Do not return password by default in queries
  },
  college: {
    type: String,
    required: [true, 'Please specify your college']
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing' // References specific books they want to keep an eye on
  }],
  averageRating: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
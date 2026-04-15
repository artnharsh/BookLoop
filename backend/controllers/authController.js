const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Helper Function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

/**
 * @desc    Register a new student
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, college } = req.body;

    // 1. Basic validation
    if (!name || !email || !password || !college) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // 2. College Email Verification (Basic check for educational domains)
    // Adjust this regex based on the specific colleges you want to support (e.g., .ac.in, .edu)
    const emailDomainRegex = /(\.edu|\.ac\.in)$/i;
    if (!emailDomainRegex.test(email)) {
       return res.status(400).json({ message: 'Please use a valid college email address (.edu or .ac.in)' });
    }

    // 3. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // 4. Create user (password is hashed automatically by the pre-save hook in the User model)
    const user = await User.create({
      name,
      email,
      password,
      college,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

/**
 * @desc    Authenticate a user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // We must explicitly select the password because we set select: false in the model
    const user = await User.findOne({ email }).select('+password');

    // Check user and password match
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
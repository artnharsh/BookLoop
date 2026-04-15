/**
 * Middleware to restrict routes to admin users only.
 * MUST be used AFTER the 'protect' middleware so req.user is already populated.
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { admin };
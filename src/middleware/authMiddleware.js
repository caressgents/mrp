const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Attach User to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};
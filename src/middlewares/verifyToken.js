const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function verifyToken(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }
  try {
    const payload = jwt.verify(header.split(' ')[1], config.jwtSecret);
    req.user = { id: payload.id };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

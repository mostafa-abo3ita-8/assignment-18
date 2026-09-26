const jwt = require('jsonwebtoken');
const Auth = require('../models/auth');
const User = require('../models/user');
const config = require('../config');

function tokenFor(userId) {
  return jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: config.jwtExpiration });
}

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, photo = '' } = req.body;
    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ message: 'firstName, lastName, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (await Auth.findOne({ email: email.toLowerCase() }))
      return res.status(409).json({ message: 'Email is already registered' });

    const auth = await Auth.create({ firstName, lastName, email, password, photo });
    const user = await User.create({ userInfo: auth._id, email: auth.email });
    await user.populate('userInfo');
    res.status(201).json({ user, token: tokenFor(user._id) });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const auth = await Auth.findOne({ email: email?.toLowerCase() }).select('+password');
    if (!auth || !(await auth.isValidatedPassword(password)))
      return res.status(401).json({ message: 'Email or password is incorrect' });
    const user = await User.findOne({ userInfo: auth._id }).populate('userInfo');
    res.json({ user, token: tokenFor(user._id) });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id).populate('userInfo').populate('connections', 'email userInfo');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

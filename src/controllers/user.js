const User = require('../models/user');
const Post = require('../models/post');

const publicUser = q => q.populate({ path: 'userInfo', select: '-password' });

exports.getProfile = async (req, res) => {
  try {
    const user = await publicUser(User.findById(req.params.id)).populate('connections', 'email userInfo');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const posts = await Post.find({ user: user._id, deletedAt: null }).populate('userInfo').sort({ createdAt: -1 });
    res.json({ user, posts, postCount: posts.length, connectionCount: user.connections.length });
  } catch(e) { res.status(500).json({message:e.message}); }
};

exports.updateProfile = async (req,res) => {
  if (req.params.id !== req.user.id) return res.status(403).json({message:'You can update only your own profile'});
  try {
    const allowed = ['jobTitle','about','location','experience','education','skills'];
    const data = {};
    for (const k of allowed) if (req.body[k] !== undefined) data[k] = req.body[k];
    const user = await User.findByIdAndUpdate(req.user.id, {$set:data}, {new:true, runValidators:true}).populate('userInfo');
    res.json(user);
  } catch(e){res.status(400).json({message:e.message});}
};

exports.getAllUsers = async (req,res) => {
  const users = await publicUser(User.find({_id: {$ne:req.user.id}})).limit(50);
  res.json(users);
};

exports.toggleConnection = async (req,res) => {
  const { userId } = req.body;
  if (!userId || userId === req.user.id) return res.status(400).json({message:'Invalid userId'});
  const me = await User.findById(req.user.id);
  const other = await User.findById(userId);
  if (!other) return res.status(404).json({message:'User not found'});
  const exists = me.connections.some(id => id.toString() === userId);
  if (exists) {
    me.connections.pull(userId); other.connections.pull(req.user.id);
  } else {
    me.connections.addToSet(userId); other.connections.addToSet(req.user.id);
  }
  await Promise.all([me.save(), other.save()]);
  res.json({connected: !exists});
};

exports.dashboard = async (req,res) => {
  const user = await User.findById(req.user.id).populate('connections','email userInfo');
  const [posts, totalUsers] = await Promise.all([
    Post.find({user:req.user.id, deletedAt:null}).sort({createdAt:-1}).limit(10).populate('userInfo'),
    User.countDocuments()
  ]);
  res.json({ user, stats:{posts:posts.length, connections:user.connections.length, totalUsers}, posts });
};

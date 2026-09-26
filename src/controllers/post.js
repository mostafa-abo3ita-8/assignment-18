const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

const reactionTypes = ['like','love','haha','wow','sad','angry'];

function postQuery(q) { return q.populate('userInfo').populate({path:'comments', match:{deletedAt:null}, populate:{path:'userInfo'}}); }

exports.createPost = async (req,res) => {
  try {
    const user = await User.findById(req.user.id);
    const post = await Post.create({ user:user._id, userInfo:user.userInfo, title:req.body.title, photo:req.body.photo || '', location:req.body.location || '' });
    res.status(201).json(await postQuery(Post.findById(post._id)));
  } catch(e){res.status(400).json({message:e.message});}
};

exports.getPost = async (req,res) => {
  const post = await postQuery(Post.findOne({_id:req.params.id, deletedAt:null}));
  if (!post) return res.status(404).json({message:'Post not found'});
  res.json(post);
};

exports.updatePost = async (req,res) => {
  const post=await Post.findOne({_id:req.params.id,deletedAt:null});
  if(!post)return res.status(404).json({message:'Post not found'});
  if(post.user.toString()!==req.user.id)return res.status(403).json({message:'Only owner can update'});
  const allowed={}; ['title','photo','location'].forEach(k=>{if(req.body[k]!==undefined)allowed[k]=req.body[k]});
  Object.assign(post,allowed); await post.save(); res.json(post);
};

exports.deletePost = async (req,res) => {
  const post=await Post.findOne({_id:req.params.id,deletedAt:null});
  if(!post)return res.status(404).json({message:'Post not found'});
  if(post.user.toString()!==req.user.id)return res.status(403).json({message:'Only owner can delete'});
  await Post.findByIdAndUpdate(post._id,{deletedAt:new Date()});
  await Comment.updateMany({post:post._id,deletedAt:null},{deletedAt:new Date()});
  res.json({message:'Post soft-deleted with its comments'});
};

exports.hardDeletePost = async (req,res) => {
  const post=await Post.findById(req.params.id);
  if(!post)return res.status(404).json({message:'Post not found'});
  if(post.user.toString()!==req.user.id)return res.status(403).json({message:'Only owner can delete'});
  await Post.findOneAndDelete({_id:post._id});
  res.json({message:'Post permanently deleted; child comments removed by cascade hook'});
};

exports.reactToPost = async (req,res) => {
  const {type}=req.body;
  if(!reactionTypes.includes(type))return res.status(400).json({message:'Invalid reaction type'});
  const post=await Post.findOne({_id:req.params.id,deletedAt:null});
  if(!post)return res.status(404).json({message:'Post not found'});
  post.reactions=post.reactions.filter(r=>r.user.toString()!==req.user.id);
  post.reactions.push({user:req.user.id,type});
  await post.save();
  res.json({reactions:post.reactions, myReaction:type});
};

exports.removeReaction = async(req,res)=>{
  const post=await Post.findById(req.params.id);
  if(!post)return res.status(404).json({message:'Post not found'});
  post.reactions=post.reactions.filter(r=>r.user.toString()!==req.user.id);
  await post.save(); res.json({reactions:post.reactions});
};

exports.newsFeed = async(req,res)=>{
  const me=await User.findById(req.user.id);
  const ids=[req.user.id,...me.connections.map(x=>x.toString())];
  const posts=await postQuery(Post.find({user:{$in:ids},deletedAt:null}).sort({createdAt:-1}).limit(50));
  res.json(posts);
};

exports.profilePosts = async(req,res)=>{
  res.json(await postQuery(Post.find({user:req.params.userId,deletedAt:null}).sort({createdAt:-1})));
};

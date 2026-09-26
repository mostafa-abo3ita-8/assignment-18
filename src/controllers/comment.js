const Comment=require('../models/comment');
const Post=require('../models/post');
const User=require('../models/user');
const reactionTypes=['like','love','haha','wow','sad','angry'];

exports.create=async(req,res)=>{
 try{
  const user=await User.findById(req.user.id);
  const post=await Post.findOne({_id:req.params.postId,deletedAt:null});
  if(!post)return res.status(404).json({message:'Post not found'});
  const c=await Comment.create({post:post._id,user:user._id,userInfo:user.userInfo,commentText:req.body.commentText});
  await Post.findByIdAndUpdate(post._id,{$addToSet:{comments:c._id}});
  res.status(201).json(await c.populate('userInfo'));
 }catch(e){res.status(400).json({message:e.message});}
};
exports.getAll=async(req,res)=>{
 const comments=await Comment.find({post:req.params.postId,deletedAt:null}).populate('userInfo').sort({createdAt:-1});
 res.json(comments);
};
exports.update=async(req,res)=>{
 const c=await Comment.findOne({_id:req.params.commentId,deletedAt:null});
 if(!c)return res.status(404).json({message:'Comment not found'});
 if(c.user.toString()!==req.user.id)return res.status(403).json({message:'Only owner can update'});
 c.commentText=req.body.commentText;c.save();res.json(c);
};
exports.delete=async(req,res)=>{
 const c=await Comment.findOne({_id:req.params.commentId,deletedAt:null});
 if(!c)return res.status(404).json({message:'Comment not found'});
 if(c.user.toString()!==req.user.id)return res.status(403).json({message:'Only owner can delete'});
 c.deletedAt=new Date();await c.save();res.json({message:'Comment soft-deleted'});
};
exports.hardDelete=async(req,res)=>{
 const c=await Comment.findById(req.params.commentId);
 if(!c)return res.status(404).json({message:'Comment not found'});
 if(c.user.toString()!==req.user.id)return res.status(403).json({message:'Only owner can delete'});
 await Comment.deleteOne({_id:c._id});await Post.updateOne({_id:c.post},{$pull:{comments:c._id}});
 res.json({message:'Comment permanently deleted'});
};
exports.react=async(req,res)=>{
 const {type}=req.body;if(!reactionTypes.includes(type))return res.status(400).json({message:'Invalid reaction'});
 const c=await Comment.findOne({_id:req.params.commentId,deletedAt:null});if(!c)return res.status(404).json({message:'Comment not found'});
 c.reactions=c.reactions.filter(r=>r.user.toString()!==req.user.id);c.reactions.push({user:req.user.id,type});await c.save();res.json(c);
};

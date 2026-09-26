const Conversation=require('../models/conversation');
const Message=require('../models/message');

async function getConversation(req,res){
 const c=await Conversation.findOne({_id:req.params.id,participants:req.user.id}).populate('participants','email userInfo').populate('lastMessage');
 if(!c)return res.status(404).json({message:'Conversation not found'});res.json(c);
}
exports.createOrGet=async(req,res)=>{
 const {userId}=req.body;
 if(!userId||userId===req.user.id)return res.status(400).json({message:'Invalid userId'});
 let c=await Conversation.findOne({participants:{$all:[req.user.id,userId],$size:2}});
 if(!c)c=await Conversation.create({participants:[req.user.id,userId]});
 res.json(await Conversation.findById(c._id).populate('participants','email userInfo'));
};
exports.list=async(req,res)=>res.json(await Conversation.find({participants:req.user.id}).sort({updatedAt:-1}).populate('participants','email userInfo').populate('lastMessage'));
exports.get=getConversation;
exports.messages=async(req,res)=>{
 const c=await Conversation.findOne({_id:req.params.id,participants:req.user.id});
 if(!c)return res.status(404).json({message:'Conversation not found'});
 res.json(await Message.find({conversation:c._id}).sort({createdAt:1}).populate('sender','email userInfo'));
};

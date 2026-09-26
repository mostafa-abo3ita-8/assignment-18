const { Server }=require('socket.io');
const jwt=require('jsonwebtoken');
const config=require('../config');
const Conversation=require('../models/conversation');
const Message=require('../models/message');

function initSocket(server){
 const io=new Server(server,{cors:{origin:config.clientUrl==='*'?'*':config.clientUrl,credentials:true}});
 io.use((socket,next)=>{
  try{
   const token=socket.handshake.auth?.token || socket.handshake.headers.authorization?.replace('Bearer ','');
   if(!token) return next(new Error('Authentication required'));
   socket.user=jwt.verify(token,config.jwtSecret);next();
  }catch(e){next(new Error('Invalid token'));}
 });
 io.on('connection',socket=>{
  socket.join(`user:${socket.user.id}`);
  socket.on('joinConversation',async conversationId=>{
   const c=await Conversation.findOne({_id:conversationId,participants:socket.user.id});
   if(c) socket.join(`conversation:${conversationId}`);
  });
  socket.on('sendMessage',async({conversationId,text},ack)=>{
   try{
    const c=await Conversation.findOne({_id:conversationId,participants:socket.user.id});
    if(!c) throw new Error('Conversation not found');
    if(!text?.trim()) throw new Error('Message cannot be empty');
    const msg=await Message.create({conversation:c._id,sender:socket.user.id,text:text.trim(),readBy:[socket.user.id]});
    c.lastMessage=msg._id;await c.save();
    const populated=await Message.findById(msg._id).populate('sender','email userInfo');
    io.to(`conversation:${conversationId}`).emit('newMessage',populated);
    if(ack)ack({ok:true,message:populated});
   }catch(e){if(ack)ack({ok:false,message:e.message});}
  });
  socket.on('typing',({conversationId})=>socket.to(`conversation:${conversationId}`).emit('typing',{userId:socket.user.id}));
 });
 return io;
}
module.exports=initSocket;

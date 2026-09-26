const User=require('./user');
const Post=require('./post');
User.pre('findOneAndDelete',async function(next){
  const user=await this.model.findOne(this.getQuery()).select('_id');
  if(user) await Post.deleteMany({user:user._id});
  next();
});
module.exports={};

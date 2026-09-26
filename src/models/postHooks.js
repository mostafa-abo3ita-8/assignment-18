const Post=require('./post');
const Comment=require('./comment');

// HARD DELETE: deleting a post removes all of its comments.
Post.pre('findOneAndDelete',async function(next){
  const doc=await this.model.findOne(this.getQuery()).select('_id');
  if(doc) await Comment.deleteMany({post:doc._id});
  next();
});

// SOFT DELETE: deleting a post also soft-deletes its comments.
Post.pre('findOneAndUpdate',async function(next){
  const update=this.getUpdate() || {};
  const deletedAt=update.deletedAt || update.$set?.deletedAt;
  if(deletedAt) {
    const doc=await this.model.findOne(this.getQuery()).select('_id');
    if(doc) await Comment.updateMany({post:doc._id, deletedAt:null},{deletedAt});
  }
  next();
});
module.exports={};

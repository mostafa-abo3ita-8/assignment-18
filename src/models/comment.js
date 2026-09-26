const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  commentText: { type: String, required: true, trim: true },
  reactions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['like','love','haha','wow','sad','angry'] }
  }],
  deletedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);

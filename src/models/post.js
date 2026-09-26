const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
    required: true
  }
}, { _id: false });

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  title: { type: String, required: true, trim: true, minlength: 1 },
  photo: { type: String, default: '' },
  location: { type: String, default: '' },
  reactions: { type: [reactionSchema], default: [] },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  deletedAt: { type: Date, default: null }
}, { timestamps: true });

PostSchema.index({ user: 1, createdAt: -1 });
PostSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', PostSchema);

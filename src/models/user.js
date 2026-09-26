const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  email: { type: String, unique: true, sparse: true, lowercase: true },
  jobTitle: String,
  about: String,
  location: String,
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  experience: [{ position: String, company: String, location: String, summary: String }],
  education: [{ schoolName: String, course: String, summary: String }],
  skills: { type: [String], default: [] },
  bookmarkedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

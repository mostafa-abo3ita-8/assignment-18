const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AuthSchema = new mongoose.Schema({
  firstName: { type: String, trim: true, required: true },
  lastName: { type: String, trim: true, required: true },
  email: { type: String, trim: true, lowercase: true, unique: true, required: true },
  password: { type: String, required: true, select: false },
  photo: { type: String, default: '' },
  emailVerified: { type: Boolean, default: false }
}, { timestamps: true });

AuthSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

AuthSchema.methods.isValidatedPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Auth', AuthSchema);

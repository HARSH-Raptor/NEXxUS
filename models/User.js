const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  college: String,
  role: { type: String, default: 'student' }, // student/admin/central
  verified: { type: Boolean, default: false },
  wallet: { type: Number, default: 0 },
  profilePic: { type: String, default: '' },
  points: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);

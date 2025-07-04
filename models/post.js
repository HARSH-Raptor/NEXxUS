const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String, // skill, service, product
  isFree: { type: Boolean, default: false },
  status: { type: String, default: 'available' }, // available, sold, etc.
  college: String,
  postedBy: {
    name: String,
    email: String,
  },
  datePosted: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);

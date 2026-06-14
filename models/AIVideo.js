const mongoose = require('mongoose');

const aiVideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  prompt: { type: String, default: '' },
  video: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('AIVideo', aiVideoSchema);

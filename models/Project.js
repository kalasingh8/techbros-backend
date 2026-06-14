const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  category: { type: String, required: true },
  tech: [{ type: String }],
  color: { type: String, default: '#00f0ff' },
  image: { type: String, default: '' },
  video: { type: String, default: '' },
  github: { type: String, default: '#' },
  live: { type: String, default: '#' },
  developer: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);

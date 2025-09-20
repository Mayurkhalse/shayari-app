const mongoose = require('mongoose');

const shayariSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  genre: {
    type: String,
    enum: ['romantic', 'sad', 'funny', 'motivational', 'other'],
    default: 'other'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Shayari', shayariSchema);

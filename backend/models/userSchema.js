const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  extractedText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Task', taskSchema);

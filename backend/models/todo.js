const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true

  },
  description: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  }
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);

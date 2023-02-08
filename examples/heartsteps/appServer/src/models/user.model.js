const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  roles: {
    Participant: {
      type: Number,
      default: 2001
    },
    Staff: Number,
    Admin: Number
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: String
});

module.exports = mongoose.model('User', userSchema);

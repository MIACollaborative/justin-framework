const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ROLES_LIST = require('../config/rolesList.config');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    roles: {
      Participant: {
        type: Number,
        default: ROLES_LIST.Participant
      },
      Staff: Number,
      Admin: Number
    },
    password: {
      type: String,
      required: true
    },
    refreshToken: String
  },
  {
    timestamps: true,
    discriminatorKey: 'type'
  }
);

const User = mongoose.model('User', userSchema);

// participants will have { type: 'participant' }
// participants must have whatsappNum and other userSchema fields
// Docs: https://mongoosejs.com/docs/4.x/docs/discriminators.html
const Participant = User.discriminator(
  'participant',
  new Schema({
    whatsappNum: {
      type: String,
      required: true
    },
    sessionStart: {
      type: Date,
      required: false
    },
    surveyTime: {
      type: String,
      required: true,
      default: '0 10 * * *' // at 10 AM every day
    },
    language: {
      type: String,
      required: true,
      enum: ['ENGLISH', 'SPANISH'],
      default: 'ENGLISH'
    }
  })
);

const Staff = User.discriminator(
  'staff',
  new Schema({
    roles: {
      Participant: {
        type: Number,
        required: true,
        default: ROLES_LIST.Participant
      },
      Staff: {
        type: Number,
        required: true,
        default: ROLES_LIST.Staff
      },
      Admin: Number
    },
    participantList: {
      type: [String],
      required: false
    }
  })
);

const Admin = User.discriminator(
  'admin',
  new Schema({
    roles: {
      Participant: {
        type: Number,
        required: true,
        default: ROLES_LIST.Participant
      },
      Staff: {
        type: Number,
        required: true,
        default: ROLES_LIST.Staff
      },
      Admin: {
        type: Number,
        required: true,
        default: ROLES_LIST.Admin
      }
    }
  })
);

module.exports = { User, Participant, Staff, Admin };

const mongoose = require('mongoose')

const MatterSchema = new mongoose.Schema(
  {
    file: {
      uuid: String,
      file: String,
      name: String,
      url: String
    },
    pages: [String],
    published: {
      type: Boolean,
      default: false
    },
    cancelated: {
      type: Boolean,
      default: false
    },
    author: {
      uuid: String,
      firstname: String,
      lastname: String,
      email: String
    },
    reviser: {
      uuid: String,
      firstname: String,
      lastname: String,
      email: String
    },
    responsable: {
      uuid: String,
      firstname: String,
      lastname: String,
      email: String
    },
    organization: {
      uuid: String,
      name: String,
      initials: String
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model(
  'Matter',
  MatterSchema,
  'Matters'
)

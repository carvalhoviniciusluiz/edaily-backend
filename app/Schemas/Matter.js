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
    },
    published_at: Date,
    canceled_at: Date
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

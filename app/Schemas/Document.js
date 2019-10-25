const mongoose = require('mongoose')

const DocumentSchema = new mongoose.Schema(
  {
    protocolNumber: String,
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
    publishedAt: Date,
    canceledAt: Date,
    forwardedAt: Date
  },
  {
    timestamps: true
  }
)

DocumentSchema.statics.paginate = function (params, options = {}, projection) {
  return new Promise((resolve, reject) => {
    const limit = parseInt(params.limit) || 10
    const offset = parseInt(params.page) || 1

    const page = offset > 0 ? offset : 1
    const skip = (page - 1) * limit

    const iterable = [
      this.countDocuments(options),
      this.find(options, projection).skip(skip).limit(limit).lean(true)
    ]

    Promise.all(iterable)
      .then(values => {
        const [total, data] = values
        const pages = Math.ceil(total / limit) || 1

        resolve({ total, limit, page, pages, data })
      })
      .catch(error => reject(error))
  })
}

module.exports = mongoose.model(
  'Document',
  DocumentSchema,
  'Documents'
)

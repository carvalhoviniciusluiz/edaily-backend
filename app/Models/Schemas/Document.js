const mongoose = require('mongoose')
const uuid = require('uuid')

const DocumentSchema = new mongoose.Schema(
  {
    uuid: String,
    protocol: String,
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
    cancellation: {
      author: {
        uuid: String,
        firstname: String,
        lastname: String,
        email: String
      },
      canceledAt: Date
    },
    publication: {
      author: {
        uuid: String,
        firstname: String,
        lastname: String,
        email: String
      },
      publishedAt: Date
    },
    forwarding: {
      author: {
        uuid: String,
        firstname: String,
        lastname: String,
        email: String
      },
      forwardedAt: Date
    }
  },
  {
    timestamps: true
  }
)

DocumentSchema.pre('save', function (next) {
  const self = this
  if (!self.uuid) {
    self.uuid = uuid.v4()
  }
  next()
})

DocumentSchema.statics.paginate = function (params, options = {}, projection) {
  return new Promise((resolve, reject) => {
    const perPage = Number(params.perPage) || 10
    const offset = Number(params.page) || 1

    const page = offset > 0 ? offset : 1
    const skip = (page - 1) * perPage

    const iterable = [
      this.countDocuments(options),
      this.find(options, projection)
        .skip(skip)
        .limit(perPage)
        .lean(true)
        .sort({
          'forwarding.forwardedAt': -1,
          protocol: 1,
          createdAt: 1
        })
    ]

    Promise.all(iterable)
      .then(values => {
        const [total, data] = values
        const lastPage = Math.ceil(total / perPage) || 1

        resolve({ perPage, page, lastPage, total, data })
      })
      .catch(error => reject(error))
  })
}

module.exports = mongoose.model(
  'Document',
  DocumentSchema,
  'Documents'
)

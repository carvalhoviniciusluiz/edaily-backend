'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

const Document = use('App/Models/Schemas/Document')

class DocumentController {
  async documents (parent, arg, ctx) {
    const {
      organization = {},
      document = {},
      user = {},
      page = 1,
      perPage = 10
    } = arg

    const o = await Organization
      .findByOrFail('uuid', organization.uuid)

    const u = await User
      .findByOrFail('uuid', user.uuid)

    const conditions = document.uuid
      ? { uuid: document.uuid }
      : {
        $or: [
          {
            'author.uuid': u.uuid
          }, {
            'reviser.uuid': u.uuid
          }
        ],
        'organization.uuid': o.uuid
      }

    const documents = await Document.paginate({ page, perPage }, conditions)

    return documents
  }

  async documentsForAnalysis (parent, arg, { response, auth }) {
    const { page = 1, perPage = 10 } = arg

    const organization = await auth
      .user
      .organization()
      .fetch()

    if (!organization) {
      return response
        .status(400)
        .send(false)
    }

    const documents = await Document.paginate(
      {
        page,
        perPage
      }, {
        forwardedAt: {
          $exists: false
        },
        canceledAt: {
          $exists: false
        },
        'organization.uuid': organization.uuid
      }
    )

    return documents
  }

  async sentDocuments (parent, arg, { response, auth }) {
    const { page = 1, perPage = 10 } = arg

    const organization = await auth
      .user
      .organization()
      .fetch()

    if (!organization) {
      return response
        .status(400)
        .send(false)
    }

    const documents = await Document.paginate(
      {
        page,
        perPage
      }, {
        forwardedAt: {
          $exists: true
        },
        canceledAt: {
          $exists: false
        },
        'organization.uuid': organization.uuid
      }
    )

    return documents
  }

  static middlewares () {
    return {
      documents: [
        'documentValidator'
      ]
    }
  }
}

module.exports = DocumentController

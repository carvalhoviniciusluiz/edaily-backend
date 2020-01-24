'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

const Document = use('App/Models/Schemas/Document')

class DocumentController {
  async getAllDocuments (parent, args, ctx) {
    const { organization, user, page = 1, perPage = 10 } = args

    const o = await Organization
      .findByOrFail('uuid', organization.uuid)

    const u = await User
      .findByOrFail('uuid', user.uuid)

    const conditions = {
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

  async getDocument (parent, args, ctx) {
    const { document } = args

    const d = await Document.findOne(document).lean(true)

    return d
  }

  async documentsForAnalysis (parent, args, { response, auth }) {
    const { page = 1, perPage = 10 } = args

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
        'forwarding.forwardedAt': {
          $exists: false
        },
        'cancellation.canceledAt': {
          $exists: false
        },
        'organization.uuid': organization.uuid
      }
    )

    return documents
  }

  async sentDocuments (parent, args, { response, auth }) {
    const { page = 1, perPage = 10 } = args

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
        'forwarding.forwardedAt': {
          $exists: true
        },
        'cancellation.canceledAt': {
          $exists: false
        },
        'organization.uuid': organization.uuid
      }
    )

    return documents
  }

  static middlewares () {
    return {
      getAllDocuments: [
        'organizationExists',
        'userExists'
      ],
      getDocument: [
        'organizationExists',
        'documentExists'
      ]
    }
  }
}

module.exports = DocumentController

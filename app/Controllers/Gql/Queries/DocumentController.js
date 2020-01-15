'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

const Document = use('App/Models/Schemas/Document')

class DocumentController {
  async documents (parent, arg, ctx) {
    const { organization, document, page = 1, perPage = 10 } = arg

    const o = await Organization
      .findByOrFail('uuid', organization.uuid)

    const u = await User
      .findByOrFail('uuid', document.uuid)

    const documents = await Document.paginate({ page, perPage }, {
      $or: [{
        'author.uuid': u.uuid
      }, {
        'reviser.uuid': u.uuid
      }],
      'organization.uuid': o.uuid
    })

    return documents
  }
}

module.exports = DocumentController

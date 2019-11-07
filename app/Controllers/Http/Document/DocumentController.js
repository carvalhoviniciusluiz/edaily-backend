'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

const Document = use('App/Schemas/Document')

class DocumentController {
  async index ({ request, params }) {
    const organization = await Organization
      .findByOrFail('uuid', params.organizations_id)

    const user = await User
      .findByOrFail('uuid', params.users_id)

    const documents = await Document.paginate(request.all(), {
      $or: [{
        'author.uuid': user.uuid
      }, {
        'reviser.uuid': user.uuid
      }],
      'organization.uuid': organization.uuid
    }, '-__v -pages -createdAt')

    return documents
  }

  async show ({ params }) {
    const document = await Document.findById(params.id, '-__v -createdAt -pages')

    return document
  }
}

module.exports = DocumentController

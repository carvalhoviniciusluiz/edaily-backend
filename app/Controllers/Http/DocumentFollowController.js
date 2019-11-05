'use strict'

const Document = use('App/Schemas/Document')

class DocumentFollowController {
  async index ({ request, response, auth }) {
    await auth.user.load('organization')

    const organizationExists = !!auth.user.toJSON().organization
    if (!organizationExists) {
      return response
        .status(400)
        .send({ erro: { message: 'Usuário sem vinculo' } })
    }

    const documents = await Document.paginate(request.all(), {
      forwardedAt: { $exists: true },
      canceledAt: { $exists: false },
      'organization.uuid': auth.user.toJSON().organization.uuid
    }, '-__v -pages -updatedAt')

    return {
      ...documents,
      data: documents.data.map(document => ({
        id: document._id,
        protocolNumber: document.protocolNumber,
        file: {
          id: document.file.uuid,
          name: document.file.name,
          url: document.file.url
        },
        responsable: {
          firstname: document.responsable.firstname,
          lastname: document.responsable.lastname
        },
        organization: {
          initials: document.organization.initials
        },
        forwardedAt: document.forwardedAt
      }))
    }
  }

  async show ({ params }) {
    const document = await Document.findById(params.id, '-__v -createdAt -pages')

    return document
  }
}

module.exports = DocumentFollowController

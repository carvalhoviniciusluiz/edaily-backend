'use strict'

const Document = use('App/Schemas/Document')

class DocumentFollowController {
  async index ({ request }) {
    const documents = await Document.paginate(request.all(), {
      forwardedAt: { $exists: true },
      canceledAt: { $exists: false }
    }, '-__v -pages -updatedAt')

    return {
      ...documents,
      data: documents.data.map(document => {
        const data = {
          id: document._id,
          file: {
            id: document.file.uuid,
            name: document.file.name,
            url: document.file.url
          },
          responsable: {
            firstname: document.responsable.firstname,
            lastname: document.responsable.lastname
          },
          forwardedAt: document.forwardedAt
        }

        const organizationExists = !!document.organization

        if (organizationExists) {
          data.organization = {
            initials: document.organization.initials
          }
        }

        return data
      })
    }
  }
}

module.exports = DocumentFollowController

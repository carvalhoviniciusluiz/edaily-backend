'use strict'

const Document = use('App/Schemas/Document')

class DocumentFollowController {
  async index ({ request }) {
    const documents = await Document.paginate(request.all(), {
      forwarded_at: { $exists: true },
      canceled_at: { $exists: false }
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
          author: {
            firstname: document.author.firstname,
            lastname: document.author.lastname
          },
          createdAt: document.createdAt
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

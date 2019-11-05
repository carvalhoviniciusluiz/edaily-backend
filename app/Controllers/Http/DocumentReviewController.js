'use strict'

const getYear = require('date-fns/getYear')

const Organization = use('App/Models/Organization')
const Document = use('App/Schemas/Document')

class DocumentReviewController {
  async index ({ request, response, auth }) {
    await auth.user.load('organization')

    const organizationExists = !!auth.user.toJSON().organization
    if (!organizationExists) {
      return response
        .status(400)
        .send({ erro: { message: 'Usuário sem vinculo' } })
    }

    const documents = await Document.paginate(request.all(), {
      forwardedAt: { $exists: false },
      canceledAt: { $exists: false },
      'organization.uuid': auth.user.toJSON().organization.uuid
    }, '-__v -pages -updatedAt')

    return {
      ...documents,
      data: documents.data.map(document => ({
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
        organization: {
          initials: document.organization.initials
        },
        createdAt: document.createdAt
      }))
    }
  }

  /**
   * @see https://www.comprasgovernamentais.gov.br/index.php/pen/numero-unico-de-protocolo
   */
  async update ({ params, auth }) {
    const document = await Document.findById(params.id)

    const organization = await Organization
      .findByOrFail('uuid', document.organization.uuid)

    const currentYear = getYear(new Date())
    const numberDocuments = await Document.countDocuments({
      forwardedAt: {
        $gte: new Date(currentYear, 0, 0),
        $lte: new Date()
      },
      'organization.uuid': document.organization.uuid
    })

    const firstSequence = String(organization.fingerprint).padStart(7, '0')
    const secondSequence = String(numberDocuments + 1).padStart(8, '0')
    const thirdSequence = currentYear

    const baseNumber = parseInt(
      `${firstSequence}${secondSequence}${thirdSequence}`
    )

    const verifyingDigit = 98 - ((baseNumber * 100) % 97)

    document.protocolNumber =
      `${firstSequence}.${secondSequence}/${thirdSequence}-${verifyingDigit}`

    document.forwardedAt = new Date()

    document.responsable = {
      uuid: auth.user.uuid,
      firstname: auth.user.firstname,
      lastname: auth.user.lastname,
      email: auth.user.email
    }

    await document.save()
  }
}

module.exports = DocumentReviewController

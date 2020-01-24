'use strict'

const getYear = require('date-fns/getYear')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

const Document = use('App/Models/Schemas/Document')

class DocumentController {
  /**
   * @see https://www.comprasgovernamentais.gov.br/index.php/pen/numero-unico-de-protocolo
   */
  async sendDocument (parent, arg, { response, auth }) {
    const { document, organization } = arg

    const d = await Document.findOne(document)
    if (d.protocol) {
      return response
        .status(201)
        .send(false)
    }

    const o = await Organization
      .findByOrFail('uuid', organization.uuid)

    if (d.organization.uuid !== o.uuid) {
      return response
        .status(400)
        .send(false)
    }

    const currentYear = getYear(new Date())
    const numberDocuments = await Document.countDocuments({
      'forwarding.forwardedAt': {
        $gte: new Date(currentYear, 0, 0),
        $lte: new Date()
      },
      'organization.uuid': d.organization.uuid
    })

    const firstSequence = String(o.fingerprint).padStart(7, '0')
    const secondSequence = String(numberDocuments + 1).padStart(8, '0')
    const thirdSequence = currentYear

    const baseNumber = Number(
      `${firstSequence}${secondSequence}${thirdSequence}`
    )

    const verifyingDigit = 98 - ((baseNumber * 100) % 97)

    d.protocol =
      `${firstSequence}.${secondSequence}/${thirdSequence}-${verifyingDigit}`

    d.forwarding = {
      author: {
        uuid: auth.user.uuid,
        firstname: auth.user.firstname,
        lastname: auth.user.lastname,
        email: auth.user.email
      },
      forwardedAt: new Date()
    }

    d.responsable = {
      uuid: auth.user.uuid,
      firstname: auth.user.firstname,
      lastname: auth.user.lastname,
      email: auth.user.email
    }

    await d.save()

    return d
  }

  static middlewares () {
    return {
      sendDocument: [
        'documentExists',
        'organizationExists'
      ]
    }
  }
}

module.exports = DocumentController

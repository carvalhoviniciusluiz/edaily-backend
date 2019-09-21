'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const UserHelper = require('../Helpers/UserHelper')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

class OrganizationController {
  async index ({ request }) {
    const { page } = request.get('page')
    const { limit } = request.get('limit')

    const organizations = await Organization
      .query()
      .with('users')
      .with('author')
      .with('revisor')
      .paginate(page, limit)

    return organizations
  }

  async store ({ request }) {
    const {
      company,
      responsible,
      substitute,
      sending_authorized_email: shippingAllowed,
      billing_authorized_email: chargeAllowed,
      authorized_and_accepted_policy_terms: termsAccepted
    } = request.all()

    const userResponsible = await UserHelper.register({
      ...responsible,
      is_responsible: true
    })

    const organization = await Organization.create({
      ...company,
      sending_authorized_email: !!shippingAllowed,
      billing_authorized_email: !!chargeAllowed,
      authorized_and_accepted_policy_terms: !!termsAccepted,
      author_id: userResponsible.id,
      revisor_id: userResponsible.id
    })

    userResponsible.organization_id = organization.id
    await userResponsible.save()

    if (substitute) {
      const userSubstitute = await UserHelper.register({
        ...substitute,
        is_responsible: true
      })

      userSubstitute.organization_id = organization.id
      await userSubstitute.save()
    }
  }

  async show ({ params, response }) {
    try {
      const organization = await Organization.findByOrFail('uuid', params.id)

      await organization.load('author')
      await organization.load('revisor')
      await organization.load('users')
      await organization.load('file')

      return organization
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Organização não localizada.' } })
    }
  }

  async update ({ params, request, response, auth }) {
    try {
      const organization = await Organization.findByOrFail('uuid', params.id)

      const data = request.only([
        'name',
        'initials',
        'cnpj',
        'billing_email',
        'phone1',
        'phone2'
      ])

      organization.merge({
        ...data,
        revisor_id: auth.user.id
      })

      await organization.save()

      await organization.load('author')
      await organization.load('revisor')
      await organization.load('users')
      await organization.load('file')

      return organization
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Organização não encontrada.' } })
    }
  }

  async destroy ({ params }) {
    // const organization = await Organization.findByOrFail('uuid', params.id)
    // await organization.delete()
  }
}

module.exports = OrganizationController

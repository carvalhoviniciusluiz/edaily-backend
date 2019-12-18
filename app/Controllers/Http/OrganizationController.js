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
      terms_accepted: termsAccepted
    } = request.all()

    const userResponsible = await UserHelper.register({
      ...responsible,
      is_responsible: true
    })

    const organization = await Organization.create({
      ...company,
      terms_accepted: !!termsAccepted,
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

  async show ({ params }) {
    const organization = await Organization.findByOrFail('uuid', params.id)

    await organization.load('author')
    await organization.load('revisor')
    await organization.load('users')
    await organization.load('file')

    return organization
  }

  async update ({ params, request, auth }) {
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
  }

  async destroy ({ params }) {
    // const organization = await Organization.findByOrFail('uuid', params.id)
    // await organization.delete()
  }
}

module.exports = OrganizationController

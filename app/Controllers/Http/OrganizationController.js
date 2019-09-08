'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

class OrganizationController {
  async index () {
    const organizations = await Organization
      .query()
      .with('users')
      .with('author')
      .with('revisor')
      .fetch()

    return organizations
  }

  async store ({ request, auth }) {
    const data = request.only([
      'name',
      'initials',
      'cnpj',
      'billing_email',
      'phone1',
      'phone2'
    ])

    const organization = await Organization.create({
      ...data,
      author_id: auth.user.id,
      revisor_id: auth.user.id
    })

    await organization.load('file')
    await organization.load('users')
    await organization.load('author')
    await organization.load('revisor')

    return organization
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

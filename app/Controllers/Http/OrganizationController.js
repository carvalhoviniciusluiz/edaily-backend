'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

/**
 * Resourceful controller for interacting with organizations
 */
class OrganizationController {
  /**
   * Show a list of all organizations.
   * GET organizations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index () {
    const organizations = await Organization
      .query()
      .with('users')
      .with('author')
      .with('revisor')
      .fetch()

    return organizations
  }

  /**
   * Create/save a new organization.
   * POST organizations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
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

    return organization
  }

  /**
   * Display a single organization.
   * GET organizations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
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

  /**
   * Update organization details.
   * PUT or PATCH organizations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
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
        .send({ error: { message: 'Organização não localizada.' } })
    }
  }

  /**
   * Delete a organization with id.
   * DELETE organizations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    // const organization = await Organization.findByOrFail('uuid', params.id)
    // await organization.delete()
  }
}

module.exports = OrganizationController

'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

class OrganizationController {
  async organizations (parent, arg, ctx) {
    const {
      organization = {},
      page = 1,
      perPage = 10
    } = arg

    const organizations = await Organization
      .query()
      .where(organization)
      .with('users')
      .with('author')
      .with('revisor')
      .paginate(page, perPage)

    return organizations.toJSON()
  }

  static middlewares () {
    return {
      organizations: [
        'authValidator'
      ]
    }
  }
}

module.exports = OrganizationController

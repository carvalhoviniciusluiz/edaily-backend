'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

class OrganizationController {
  async organizations (parent, arg, ctx) {
    const { page = 1, limit = 10, ...conditions } = arg

    const organizations = await Organization
      .query()
      .where(conditions)
      .with('users')
      .with('author')
      .with('revisor')
      .paginate(page, limit)

    return organizations.toJSON()
  }
}

module.exports = OrganizationController

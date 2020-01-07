'use strict'

const Organization = use('App/Models/Organization')

class OrganizationController {
  async organizations (parent, arg, ctx) {
    const { page = 1, limit = 10 } = arg

    return Organization
      .query()
      .paginate(page, limit)
  }
}

module.exports = OrganizationController

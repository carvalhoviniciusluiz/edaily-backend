'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const UserHelper = require('../../Helpers/UserHelper')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

class OrganizationController {
  async addOrganizationWithResponsibleAndSubstitute (parent, arg, ctx) {
    const { organization, responsible, substitute } = arg

    const userResponsible = await UserHelper.register({
      ...responsible,
      is_responsible: true
    })

    const org = await Organization.create({
      ...organization,
      author_id: userResponsible.id,
      revisor_id: userResponsible.id
    })

    userResponsible.organization_id = org.id
    await userResponsible.save()

    if (substitute) {
      const userSubstitute = await UserHelper.register({
        ...substitute,
        is_responsible: true
      })

      userSubstitute.organization_id = org.id
      await userSubstitute.save()
    }

    return org.toJSON()
  }

  static middlewares () {
    return {
      addOrganizationWithResponsibleAndSubstitute: [
        'organizationValidator',
        'responsibleValidator',
        'substituteValidator'
      ]
    }
  }
}

module.exports = OrganizationController

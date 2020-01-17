'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

class UserController {
  async getAllUsers (parent, args, ctx) {
    const { organization, page = 1, perPage = 10 } = args

    const o = await Organization
      .query()
      .where('uuid', organization.uuid)
      .first()

    const users = await o
      .users()
      .with('avatar', avatar => {
        avatar.setVisible(['avatar'])
      })
      .paginate(page, perPage)

    return users.toJSON()
  }

  async getUser (parent, args, ctx) {
    const { organization, user } = args

    const o = await Organization
      .query()
      .where('uuid', organization.uuid)
      .first()

    const u = await User
      .query()
      .with('avatar')
      .where('organization_id', o.id)
      .where('uuid', user.uuid)
      .first()

    return u.toJSON()
  }

  static middlewares () {
    return {
      getAllUsers: [
        'organizationExists'
      ],
      getUser: [
        'organizationExists',
        'userExists'
      ]
    }
  }
}

module.exports = UserController

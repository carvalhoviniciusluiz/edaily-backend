'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

class UserController {
  async users (parent, arg, ctx) {
    const {
      organization = {},
      user = {},
      page = 1,
      perPage = 10
    } = arg

    if (organization.uuid) {
      const o = await Organization
        .findByOrFail('uuid', organization.uuid)

      if (!o) {
        return
      }

      const users = await o
        .users()
        .with('avatar', avatar => {
          avatar.setVisible(['avatar'])
        })
        .paginate(page, perPage)

      return users.toJSON()
    }

    if (user.uuid) {
      const u = await User
        .findByOrFail('uuid', user.uuid)

      await u.load('avatar', avatar => {
        avatar.setVisible(['avatar'])
      })

      return {
        perPage,
        page,
        lastPage: 1,
        total: 1,
        data: [u.toJSON()]
      }
    }
  }
}

module.exports = UserController

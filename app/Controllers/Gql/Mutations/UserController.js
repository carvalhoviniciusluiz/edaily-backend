'use strict'

const UserHelper = require('../../Helpers/UserHelper')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

class UserController {
  async addUser (parent, arg, { auth }) {
    const { organization = {}, user } = arg

    if (organization.uuid) {
      const o = await Organization
        .findByOrFail('uuid', organization.uuid)

      if (o) {
        const u = await UserHelper.register({
          ...user,
          organization_id: o.id
          // author_id: auth.user.id,
          // revisor_id: auth.user.id
        })

        await u.load('organization')
        await u.load('avatar')

        return u.toJSON()
      }
    }
  }

  async updateUser (parent, arg, { auth }) {
    const { user = {}, data } = arg

    const u = await User
      .findByOrFail('uuid', user.uuid)

    if (u) {
      u.merge({
        ...data
        // revisor_id: auth.user.id
      })

      await u.save()

      return u.toJSON()
    }
  }

  static middlewares () {
    return {
      addUser: [
        'userCreateValidator'
      ],
      updateUser: [
        'userUpdateValidator'
      ]
    }
  }
}

module.exports = UserController

'use strict'

const UserHelper = require('../../Helpers/UserHelper')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const File = use('App/Models/File')

class UserController {
  async addUser (parent, arg, { auth }) {
    const { organization, user } = arg

    const o = await Organization
      .findByOrFail('uuid', organization.uuid)

    const u = await UserHelper.register({
      ...user,
      organization_id: o.id,
      author_id: auth.user.id,
      revisor_id: auth.user.id
    })

    await u.load('organization')
    await u.load('avatar')

    return u.toJSON()
  }

  async updateUser (parent, arg, { auth }) {
    const { user, data } = arg

    const u = await User
      .findByOrFail('uuid', user.uuid)

    u.merge({
      ...data,
      revisor_id: auth.user.id
    })

    await u.save()
    await u.load('organization')
    await u.load('avatar')

    return u.toJSON()
  }

  async updateAvatar (parent, arg, { auth }) {
    const { avatar } = arg

    const u = await auth
      .getUser()
    const f = await File
      .findBy('uuid', avatar.uuid)

    u.merge({
      avatar_id: f.id
    })

    const response = await u.save()
    return response
  }

  async updatePassword (parent, arg, { auth, response }) {
    const { password } = arg
    try {
      const u = await auth
        .getUser()

      if (password.old) {
        await auth.attempt(u.cpf, password.old)
      }

      u.merge({
        password: password.new
      })

      return await u.save()
    } catch (error) {
      return response
        .status(401)
        .send(false)
    }
  }

  async updateProfile (parent, arg, { auth }) {
    const { profile } = arg

    const u = await auth
      .getUser()

    u.merge(profile)

    await u.save()
    await u.load('organization')
    await u.load('avatar')

    return u.toJSON()
  }

  static middlewares () {
    return {
      addUser: [
        'organizationExists',
        'userCreateValidator'
      ],
      updateUser: [
        'organizationExists',
        'userExists',
        'userUpdateValidator'
      ],
      updateProfile: [
        'profileValidator'
      ],
      updatePassword: [
        'passwordValidator'
      ],
      updateAvatar: [
        'avatarValidator'
      ]
    }
  }
}

module.exports = UserController

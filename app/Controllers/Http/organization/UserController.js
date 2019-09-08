'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

class UserController {
  async index ({ params, response }) {
    try {
      const organization = await Organization
        .findByOrFail('uuid', params.organizations_id)

      const users = await organization.users().fetch()

      return users
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Organização não localizada.' } })
    }
  }

  async store ({ params, request, auth }) {
    const data = request.only([
      'name',
      'email',
      'cpf',
      'phone',
      'avatar_id'
    ])

    const organization = await Organization
      .findByOrFail('uuid', params.organizations_id)

    const user = new User()

    user.merge({
      ...data,
      password: '123456',
      author_id: auth.user.id,
      revisor_id: auth.user.id
    })

    await organization.users().save(user)

    await user.load('organization')
    await user.load('avatar')

    return user
  }

  async show ({ params, response }) {
    try {
      const user = await User.findByOrFail('uuid', params.id)

      await user.load('organization')
      await user.load('avatar')

      return user
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Usuário não localizada.' } })
    }
  }

  async update ({ params, request, response, auth }) {
    try {
      const user = await User.findByOrFail('uuid', params.id)

      const data = request.only([
        'name',
        'email',
        'cpf',
        'phone',
        'avatar_id'
      ])

      user.merge({
        ...data,
        revisor_id: auth.user.id
      })

      await user.save()

      await user.load('organization')
      await user.load('avatar')

      return user
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Usuário não encontrado.' } })
    }
  }

  async destroy ({ params }) {
    // const user = await User.findByOrFail('uuid', params.id)
    // await user.delete()
  }
}

module.exports = UserController

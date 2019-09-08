'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

class UserController {
  async store ({ request }) {
    const data = request.only([
      'name',
      'email',
      'cpf',
      'phone'
    ])

    const user = await User.create({
      ...data,
      password: '123456'
    })

    return user
  }
}

module.exports = UserController

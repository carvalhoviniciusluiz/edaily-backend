'use strict'

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

    return {
      ...user.toJSON(),
      password: undefined,
      id: undefined,
      created_at: undefined
    }
  }
}

module.exports = UserController

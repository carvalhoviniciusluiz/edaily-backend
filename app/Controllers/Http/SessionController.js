'use strict'

class SessionController {
  async store ({ request, response, auth }) {
    const { cpf, password } = request.only([
      'cpf',
      'password'
    ])

    const { token } = await auth.attempt(cpf, password)

    return { token }
  }
}

module.exports = SessionController

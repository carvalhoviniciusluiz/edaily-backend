'use strict'

class SessionController {
  async store ({ request, response, auth }) {
    const { email, password } = request.only([
      'email',
      'password'
    ])

    const { token } = await auth.attempt(email, password)

    return { token }
  }
}

module.exports = SessionController

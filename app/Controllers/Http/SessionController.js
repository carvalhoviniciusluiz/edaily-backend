'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

class SessionController {
  async store ({ request, auth }) {
    const { cpf, password } = request.only([
      'cpf',
      'password'
    ])

    const user = await User.findByOrFail('cpf', cpf)

    user.sign_in_count = user.sign_in_count + 1
    user.last_sign_in_at = user.current_sign_in_at
    user.last_sign_in_ip_address = user.current_sign_in_ip_address

    user.current_sign_in_at = new Date()

    // @TODO https://www.npmjs.com/package/request-ip
    user.current_sign_in_ip_address = '//** ip address **//'

    await user.save()

    const { token } = await auth.attempt(cpf, password)

    return { token }
  }
}

module.exports = SessionController

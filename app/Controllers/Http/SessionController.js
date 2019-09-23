'use strict'

const { cpf } = require('cpf-cnpj-validator')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

class SessionController {
  async store ({ request, response, auth }) {
    const { credential, password } = request.only([
      'credential',
      'password'
    ])

    const query = User.query()

    cpf.isValid(credential)
      ? query.where('cpf', credential)
      : query.where('email', credential)

    query.with('organization')
    query.with('avatar')

    const user = await query.first()

    if (!user) {
      return response
        .status(400)
        .send({ error: { message: 'As credenciais de acesso são inválidas.' } })
    }

    try {
      const { token } = await auth.attempt(user.cpf, password)

      user.sign_in_count = user.sign_in_count + 1
      user.last_sign_in_at = user.current_sign_in_at
      user.last_sign_in_ip_address = user.current_sign_in_ip_address

      user.current_sign_in_at = new Date()

      // @TODO https://www.npmjs.com/package/request-ip
      user.current_sign_in_ip_address = '//** ip address **//'

      await user.save()

      return { token, user }
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'As credenciais de acesso são inválidas.' } })
    }
  }
}

module.exports = SessionController

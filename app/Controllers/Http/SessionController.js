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

    const u = await query.first()

    if (!u) {
      return response
        .status(400)
        .send({ error: { message: 'As credenciais de acesso são inválidas.' } })
    }

    if (!u.is_active) {
      return response
        .status(401)
        .send({ error: { message: 'Conta de acesso não confirmada.' } })
    }

    try {
      const { token } = await auth.attempt(u.cpf, password)

      u.sign_in_count = u.sign_in_count + 1
      u.last_sign_in_at = u.current_sign_in_at
      u.last_sign_in_ip_address = u.current_sign_in_ip_address

      u.current_sign_in_at = new Date()

      // @TODO https://www.npmjs.com/package/request-ip
      u.current_sign_in_ip_address = '//** ip address **//'

      await u.save()

      const user = u.toJSON()
      return {
        token,
        user: {
          ...{
            uuid: user.uuid,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            cpf: user.cpf,
            rg: user.rg,
            phone: user.phone,
            zipcode: user.zipcode,
            street: user.street,
            street_number: user.street_number,
            neighborhood: user.neighborhood,
            city: user.city,
            state: user.state,
            confirmed_at: user.confirmed_at,
            sign_in_count: user.sign_in_count,
            last_sign_in_at: user.last_sign_in_at,
            organization: {
              uuid: user.organization.uuid,
              name: user.organization.name,
              initials: user.organization.initials
            }
          },
          avatar: {
            ...user.avatar,
            url: undefined
          }
        }
      }
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'As credenciais de acesso são inválidas.' } })
    }
  }
}

module.exports = SessionController

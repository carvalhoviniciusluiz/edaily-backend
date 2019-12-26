'use strict'

const Env = use('Env')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

class ConfirmationController {
  async store ({ response, request }) {
    const token = request.input('token')

    const user = await User.findByOrFail('confirmation_token', token)

    user.confirmation_token = null
    user.confirmed_at = new Date()
    user.is_active = true

    await user.save()

    response.redirect(Env.get('CLIENT_URL'))
  }
}

module.exports = ConfirmationController

'use strict'

const parseISO = require('date-fns/parseISO')
const isBefore = require('date-fns/isBefore')
const subHours = require('date-fns/subHours')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

class ResetPasswordController {
  async store ({ request, response }) {
    const { recovery_token: token, password } = request.all()

    const user = await User.findByOrFail('recovery_token', token)

    const tokenCreatedAt = user.recovery_token_created_at

    if (isBefore(parseISO(tokenCreatedAt), subHours(new Date(), 2))) {
      return response
        .status(400)
        .send({
          error: {
            message: 'Token expirado, por favor tente novamente.'
          }
        })
    }

    user.recovery_token = null
    user.recovery_token_created_at = null
    user.password = password

    await user.save()
  }
}

module.exports = ResetPasswordController

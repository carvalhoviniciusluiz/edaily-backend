'use strict'

const crypto = require('crypto')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const User = use('App/Models/User')
const Env = use('Env')
const Kue = use('Kue')
const Job = use('App/Jobs/SendForgotPasswordMail')

class ForgotPasswordController {
  async store ({ request, response }) {
    const redirectURL = request.input('redirect_url')
    if (!redirectURL) {
      return response
        .status(500)
        .send({
          error: {
            message: 'Algo deu errado ao redirecionar a página.'
          }
        })
    }

    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)

      user.recovery_token = crypto.randomBytes(10).toString('hex')
      user.recovery_token_created_at = new Date()

      await user.save()

      if (Env.get('NODE_ENV') !== 'testing') {
        Kue.dispatch(Job.key, {
          name: user.name,
          email: user.email,
          token: user.recovery_token,
          link: `${redirectURL}?token=${user.recovery_token}`
        }, { attempts: 3 })
      }
    } catch (error) {
      return response
        .status(error.status)
        .send({
          error: {
            message: 'Algo não deu certo, esse e-mail existe?'
          }
        })
    }
  }
}

module.exports = ForgotPasswordController

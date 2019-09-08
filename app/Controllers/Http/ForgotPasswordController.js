'use strict'

const moment = require('moment')
const crypto = require('crypto')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')
const Mail = use('Mail')
const Env = use('Env')

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

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      if (process.env.NODE_ENV !== 'testing') {
        await Mail.send(
          ['emails.forgot_password'],
          {
            email,
            token: user.token,
            link: `${redirectURL}?token=${user.token}`
          },
          message => {
            message
              .to(user.email, user.name)
              .from(Env.get('MAIL_FROM'), Env.get('MAIL_LOCAL'))
              .subject('Recuperação de senha')
          }
        )
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

  async update ({ request, response }) {
    try {
      const { token, password } = request.all()

      const user = await User.findByOrFail('token', token)

      const tokenExpired = moment()
        .subtract('2', 'days')
        .isAfter(user.token_created_at)

      if (tokenExpired) {
        return response
          .status(401)
          .send({
            error: {
              message: 'O token de recuperação está expirado.'
            }
          })
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()
    } catch (error) {
      return response
        .status(error.status)
        .send({
          error: {
            message: 'Algo deu errado ao resetar sua senha.'
          }
        })
    }
  }
}

module.exports = ForgotPasswordController

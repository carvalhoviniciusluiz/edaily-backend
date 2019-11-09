'use strict'

const crypto = require('crypto')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

const Env = use('Env')
const Kue = use('Kue')

const Job = use('App/Jobs/SendAccountConfirmationEmail')

class SendConfirmationController {
  async store ({ request }) {
    const email = request.input('email')
    const user = await User.findByOrFail('email', email)

    user.confirmation_token = crypto.randomBytes(32).toString('hex')

    await user.save()

    if (Env.get('NODE_ENV') !== 'testing') {
      Kue.dispatch(Job.key, {
        user,
        link: `${Env.get('APP_URL')}/confirm?token=${user.confirmation_token}`,
        team: Env.get('APP_NAME', 'Edaily')
      }, { attempts: 3 })
    }
  }
}

module.exports = SendConfirmationController

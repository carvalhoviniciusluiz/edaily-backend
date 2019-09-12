'use strict'

const crypto = require('crypto')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

const Env = use('Env')
const Kue = use('Kue')
const JobAccountConfirmation = use('App/Jobs/SendAccountConfirmationEmail')

class UserController {
  async store ({ request }) {
    const data = request.only([
      'name',
      'email',
      'cpf',
      'phone'
    ])

    const password = crypto.randomBytes(10).toString('hex')

    const user = await User.create({
      ...data,
      password
    })

    if (Env.get('NODE_ENV') !== 'testing') {
      Kue.dispatch(JobAccountConfirmation.key, {
        user,
        password,
        team: Env.get('APP_NAME', 'Edaily')
      }, { attempts: 3 })
    }

    return user
  }

  async confirm ({ response }) {
    response.redirect('https://digitalocean.com')
  }
}

module.exports = UserController

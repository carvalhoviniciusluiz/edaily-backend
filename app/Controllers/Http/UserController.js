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

    if (!user.dirty.token && Env.get('NODE_ENV') !== 'testing') {
      const avatar = await user.avatar().fetch()

      Kue.dispatch(JobAccountConfirmation.key, {
        user,
        password,
        avatar,
        hasAttachment: !!avatar
      }, { attempts: 3 })
    }

    return user
  }
}

module.exports = UserController

'use strict'

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

    const password = Math.random().toString(36).substring(2) +
      Date.now().toString(36)

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

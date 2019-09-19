'use strict'

const crypto = require('crypto')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

const Env = use('Env')
const Kue = use('Kue')

const Job = use('App/Jobs/SendAccountConfirmationEmail')

const UserHelper = exports = module.exports = {}

UserHelper.register = async (data) => {
  const password = crypto.randomBytes(10).toString('hex')

  const user = await User.create({
    ...data,
    confirmation_token: crypto.randomBytes(32).toString('hex'),
    password
  })

  if (Env.get('NODE_ENV') !== 'testing') {
    Kue.dispatch(Job.key, {
      user,
      password,
      link: `${Env.get('APP_URL')}/confirm?token=${user.confirmation_token}`,
      team: Env.get('APP_NAME', 'Edaily')
    }, { attempts: 3 })
  }

  return user
}

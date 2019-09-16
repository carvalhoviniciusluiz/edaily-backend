'use strict'

const crypto = require('crypto')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const File = use('App/Models/File')

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
      'phone',
      'avatar_id'
    ])

    const password = crypto.randomBytes(10).toString('hex')

    const user = await User.create({
      ...data,
      confirmation_token: crypto.randomBytes(32).toString('hex'),
      password
    })

    if (Env.get('NODE_ENV') !== 'testing') {
      Kue.dispatch(JobAccountConfirmation.key, {
        user,
        password,
        link: `${Env.get('APP_URL')}/confirm?token=${user.confirmation_token}`,
        team: Env.get('APP_NAME', 'Edaily')
      }, { attempts: 3 })
    }

    return user
  }

  async update ({ request, auth }) {
    const { avatar_uuid: uuidFile, ...data } = request.all()

    if (uuidFile) {
      const file = await File.findBy('uuid', uuidFile)

      data.avatar_id = file ? file.id : undefined
    }

    const user = await auth.getUser()
    user.merge(data)

    await user.save()
    await user.load('avatar')

    return user
  }
}

module.exports = UserController

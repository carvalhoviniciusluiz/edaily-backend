'use strict'

const crypto = require('crypto')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

const Env = use('Env')
const Kue = use('Kue')
const JobAccountConfirmation = use('App/Jobs/SendAccountConfirmationEmail')

class UserController {
  async index ({ params, request, response }) {
    try {
      const { page } = request.get('page')
      const { limit } = request.get('limit')

      const organization = await Organization
        .findByOrFail('uuid', params.organizations_id)

      const users = await organization
        .users()
        .with('avatar', avatar => {
          avatar.setVisible(['avatar'])
        })
        .paginate(page, limit)

      return users
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Organização não localizada.' } })
    }
  }

  async store ({ params, request, auth }) {
    const data = request.only([
      'firstname',
      'lastname',
      'email',
      'cpf',
      'rg',
      'phone',
      'zipcode',
      'street',
      'street_number',
      'neighborhood',
      'city',
      'state',
      'avatar_id'
    ])

    const organization = await Organization
      .findByOrFail('uuid', params.organizations_id)

    const user = new User()
    const password = crypto.randomBytes(10).toString('hex')

    user.merge({
      ...data,
      password,
      confirmation_token: crypto.randomBytes(32).toString('hex'),
      author_id: auth.user.id,
      revisor_id: auth.user.id
    })

    await organization.users().save(user)

    await user.load('organization')
    await user.load('avatar')

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

  async show ({ request, response, params }) {
    try {
      const user = await User.findByOrFail('uuid', params.id)
      await user.load('avatar')

      const { organization: hasOrganization } = request.get('organization')
      if (hasOrganization === 'true') {
        await user.load('organization')
      }

      return user
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Usuário não localizada.' } })
    }
  }

  async update ({ params, request, auth }) {
    const user = await User.findByOrFail('uuid', params.id)

    const data = request.only([
      'firstname',
      'lastname',
      'email',
      'cpf',
      'rg',
      'phone',
      'zipcode',
      'street',
      'street_number',
      'neighborhood',
      'city',
      'state',
      'avatar_id'
    ])

    user.merge({
      ...data,
      revisor_id: auth.user.id
    })

    await user.save()

    return user
  }

  async destroy ({ params }) {
    // const user = await User.findByOrFail('uuid', params.id)
    // await user.delete()
  }
}

module.exports = UserController

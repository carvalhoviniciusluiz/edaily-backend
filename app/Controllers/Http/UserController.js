'use strict'

const UserHelper = require('../Helpers/UserHelper')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const File = use('App/Models/File')

class UserController {
  async store ({ request }) {
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

    const user = await UserHelper.register(data)

    return user
  }

  async update ({ request, response, auth }) {
    try {
      const {
        avatar_uuid: uuidFile,
        old_password: password,
        password_confirmation: confirmation,
        ...data
      } = request.all()

      const user = await auth.getUser()

      if (password) {
        await auth.attempt(user.cpf, password)
      }

      if (uuidFile) {
        const file = await File.findBy('uuid', uuidFile)

        data.avatar_id = file ? file.id : undefined
      }

      // @TODO enquanto a solicitação de atualização não existir
      // somente esses campos estarão liberados para serem atualizados.
      const { firstname, lastname, phone } = data

      user.merge({ firstname, lastname, phone })

      await user.save()
      await user.load('avatar')

      return user
    } catch (error) {
      return response
        .status(error.status)
        .send({ erro: { message: 'Dados inválidos.' } })
    }
  }
}

module.exports = UserController

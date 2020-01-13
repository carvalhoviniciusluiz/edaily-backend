'use strict'

const { validate } = use('Validator')
const { list } = use('Antl')

class UpdateUser {
  async gqlHandle (resolve, root, args, ctx, info) {
    const { organization, user, data } = args
    const messages = list('validation')

    const validation = await validate(
      {
        organization_uuid: organization.uuid,
        user_uuid: user.uuid,
        ...data
      }, {
        organization_uuid: 'required|exists:organizations,uuid',
        user_uuid: 'required|exists:users,uuid',
        email: 'required|email',
        cpf: 'required|cpf'
      },
      messages
    )

    if (validation.fails()) {
      return ctx.response.status(400).send(false)
    }

    const result = await resolve(root, args, ctx, info)
    return result
  }
}

module.exports = UpdateUser

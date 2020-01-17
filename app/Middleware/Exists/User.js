'use strict'

const { validate } = use('Validator')
const { list } = use('Antl')

class User {
  async gqlHandle (resolve, root, args, ctx, info) {
    const { user } = args
    const messages = list('validation')

    const rules = {
      user_uuid: 'required|exists:users,uuid'
    }
    const validation = await validate(
      {
        user_uuid: user.uuid
      },
      rules,
      messages
    )

    if (validation.fails()) {
      return ctx.response.status(400).send(false)
    }

    const result = await resolve(root, args, ctx, info)
    return result
  }
}

module.exports = User

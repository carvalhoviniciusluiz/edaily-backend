'use strict'

const { validate } = use('Validator')
const { list } = use('Antl')

class Avatar {
  async gqlHandle (resolve, root, args, ctx, info) {
    const { avatar } = args
    const messages = list('validation')

    const validation = await validate(
      {
        avatar_uuid: avatar.uuid
      }, {
        avatar_uuid: 'required|exists:files,uuid'
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

module.exports = Avatar

'use strict'

const { validate } = use('Validator')
const { list } = use('Antl')

class Profile {
  async gqlHandle (resolve, root, args, ctx, info) {
    const { profile } = args
    const messages = list('validation')

    const rules = {
      firstname: 'required',
      lastname: 'required'
    }
    const validation = await validate(
      { ...profile },
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

module.exports = Profile

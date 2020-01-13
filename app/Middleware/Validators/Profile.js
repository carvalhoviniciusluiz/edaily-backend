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
      const message = JSON.stringify(validation.messages()[0])
      throw new Error(message)
    }

    const result = await resolve(root, args, ctx, info)
    return result
  }
}

module.exports = Profile

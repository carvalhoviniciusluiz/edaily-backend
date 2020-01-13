'use strict'

const { validate } = use('Validator')
const { list } = use('Antl')

class Password {
  async gqlHandle (resolve, root, args, ctx, info) {
    const { password } = args
    const messages = list('validation')

    // const userId = ctx.auth.user.id

    const rules = {
      // email: `email|unique:users,email,id,${userId}`,
      // cpf: `cpf|unique:users,cpf,id,${userId}`,
      old_password: 'min:6',
      password: 'required_if:old_password|min:6|confirmed'
    }
    const validation = await validate(
      {
        password: password.new,
        password_confirmation: password.confirmation,
        old_password: password.old
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

module.exports = Password

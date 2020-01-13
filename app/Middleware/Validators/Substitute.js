'use strict'

const { validate } = use('Validator')
const { list } = use('Antl')

class Substitute {
  async gqlHandle (resolve, root, args, ctx, info) {
    const { substitute } = args
    const messages = list('validation')

    if (substitute) {
      const validation = await validate({ ...substitute }, {
        firstname: 'required',
        lastname: 'required',
        email: 'required|email|unique:users,email',
        cpf: 'required|cpf|unique:users,cpf',
        rg: 'required',
        phone: 'required',
        zipcode: 'required',
        street: 'required',
        street_number: 'required',
        neighborhood: 'required',
        city: 'required',
        state: 'required'
      }, messages)

      if (validation.fails()) {
        return ctx.response.status(400).send(false)
      }
    }

    const result = await resolve(root, args, ctx, info)
    return result
  }
}

module.exports = Substitute

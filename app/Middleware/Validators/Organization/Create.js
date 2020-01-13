'use strict'

const { validate } = use('Validator')
const { list } = use('Antl')

class CreateOrganization {
  async gqlHandle (resolve, root, args, ctx, info) {
    const { organization } = args
    const messages = list('validation')

    const rules = {
      definition: 'required',
      name: 'required',
      initials: 'required',
      cnpj: 'required|cnpj|unique:organizations,cnpj',
      billing_email: 'required|email|unique:organizations,billing_email',
      phone1: 'required',
      zipcode: 'required',
      street: 'required',
      street_number: 'required',
      neighborhood: 'required',
      city: 'required',
      state: 'required',
      terms_accepted: 'required|boolean|accepted'
    }
    const validation = await validate(
      {
        ...organization
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

module.exports = CreateOrganization

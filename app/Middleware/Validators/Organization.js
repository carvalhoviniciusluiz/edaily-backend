'use strict'

const { validate } = use('Validator')
const { list } = use('Antl')

class Organization {
  async gqlHandle (resolve, root, args, ctx, info) {
    const { uuid, organization } = args
    const messages = list('validation')

    const rules = uuid
      ? {
        uuid: 'exists:organizations,uuid',
        name: 'string',
        initials: 'string',
        cnpj: 'cnpj',
        billing_email: 'email',
        phone1: 'string'
      }
      : {
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
        state: 'required'
      }
    const validation = await validate({ uuid, ...organization }, rules, messages)

    if (validation.fails()) {
      const message = JSON.stringify(validation.messages()[0])
      throw new Error(message)
    }

    const result = await resolve(root, args, ctx, info)
    return result
  }
}

module.exports = Organization

'use strict'

const { validate } = use('Validator')
const { list } = use('Antl')

class UpdateOrganization {
  async gqlHandle (resolve, root, args, ctx, info) {
    const { organization, data } = args
    const messages = list('validation')

    const rules = {
      organization_uuid: 'exists:organizations,uuid',
      name: 'string',
      initials: 'string',
      cnpj: 'cnpj',
      billing_email: 'email',
      phone1: 'string'
    }
    const validation = await validate(
      {
        organization_uuid: organization.uuid,
        ...data
      },
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

module.exports = UpdateOrganization

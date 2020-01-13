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
      return ctx.response.status(400).send(false)
    }

    const result = await resolve(root, args, ctx, info)
    return result
  }
}

module.exports = UpdateOrganization

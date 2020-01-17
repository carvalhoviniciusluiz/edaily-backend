'use strict'

const { validate } = use('Validator')
const { list } = use('Antl')

class Organization {
  async gqlHandle (resolve, root, args, ctx, info) {
    const { organization } = args
    const messages = list('validation')

    const rules = {
      organization_uuid: 'required|exists:organizations,uuid'
    }
    const validation = await validate(
      {
        organization_uuid: organization.uuid
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

module.exports = Organization

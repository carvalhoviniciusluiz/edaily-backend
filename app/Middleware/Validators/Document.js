'use strict'

const { validate } = use('Validator')
const { list } = use('Antl')

class Document {
  async gqlHandle (resolve, root, args, ctx, info) {
    const { organization = {}, document = {}, user = {} } = args
    const messages = list('validation')

    const validation = await validate(
      {
        organization_uuid: organization.uuid,
        user_uuid: user.uuid,
        document_uuid: document.uuid
      }, {
        organization_uuid: 'exists:organizations,uuid',
        user_uuid: 'exists:users,uuid',
        document_uuid: 'existsInMongo:Document,uuid'
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

module.exports = Document

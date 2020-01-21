'use strict'

const { validate } = use('Validator')
const { list } = use('Antl')

class Document {
  async gqlHandle (resolve, root, args, ctx, info) {
    const { document } = args
    const messages = list('validation')

    const rules = {
      document_uuid: 'required|existsInMongo:Document,uuid'
    }
    const validation = await validate(
      {
        document_uuid: document.uuid
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

module.exports = Document

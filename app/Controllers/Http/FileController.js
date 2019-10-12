'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const File = use('App/Models/File')

/** @typedef {import('@adonisjs/ignitor/src/Helpers')} Helpers */
const Helpers = use('Helpers')

const Env = use('Env')

class FileController {
  async store ({ request, response }) {
    const upload = request.file('file', {
      size: Env.get('FILE_SIZE', '10mb')
    })

    const fileName = `${Date.now()}.${upload.subtype}`

    await upload.move(Helpers.tmpPath('files'), {
      name: fileName
    })

    if (!upload.moved()) {
      throw upload.error()
    }

    const file = await File.create({
      file: fileName,
      name: upload.clientName,
      type: upload.type,
      subtype: upload.subtype
    })

    return { ...file.toJSON(), avatar: undefined }
  }

  async show ({ params, response }) {
    const file = await File.findByOrFail('uuid', params.id)

    return response.download(Helpers.tmpPath(`files/${file.file}`))
  }
}

module.exports = FileController

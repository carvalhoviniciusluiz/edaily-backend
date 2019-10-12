'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const File = use('App/Models/File')

/** @typedef {import('@adonisjs/ignitor/src/Helpers')} Helpers */
const Helpers = use('Helpers')

const Env = use('Env')

class AvatarController {
  async store ({ request }) {
    const upload = request.file('file', {
      size: Env.get('IMAGE_SIZE', '3mb')
    })

    const fileName = `${Date.now()}.${upload.subtype}`

    await upload.move(Helpers.tmpPath('avatars'), {
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

    return { ...file.toJSON(), url: undefined }
  }

  async show ({ params, response }) {
    const file = await File.findByOrFail('uuid', params.id)

    return response.download(Helpers.tmpPath(`avatars/${file.file}`))
  }
}

module.exports = AvatarController

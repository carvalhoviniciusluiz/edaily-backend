'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const File = use('App/Models/File')

/** @typedef {import('@adonisjs/ignitor/src/Helpers')} Helpers */
const Helpers = use('Helpers')

const Env = use('Env')

const BucketService = use('App/Services/BucketService')

const Kue = use('Kue')
const PdfToHtmlJob = use('App/Jobs/PdfToHtml')
const PdfToTextJob = use('App/Jobs/PdfToText')

class FileController {
  async store ({ request }) {
    const upload = request.file('file', {
      size: Env.get('FILE_SIZE', '10mb')
    })

    const tmpPath = Helpers.tmpPath('files')

    const timestamp = Date.now()
    const filename = `${timestamp}.${upload.subtype}`

    const htmlpath = `${tmpPath}/${timestamp}`
    const pathname = `${tmpPath}/${filename}`

    await upload.move(tmpPath, {
      name: filename
    })

    if (!upload.moved()) {
      throw upload.error()
    }

    const file = await File.create({
      file: filename,
      name: upload.clientName,
      type: upload.type,
      subtype: upload.subtype
    })

    if (Env.get('NODE_ENV') !== 'testing') {
      Kue.dispatch(PdfToHtmlJob.key, { pathname, htmlpath }, { attempts: 3 })
      Kue.dispatch(PdfToTextJob.key, { pathname }, { attempts: 3 })

      await BucketService.writeFile(pathname, filename)
    }

    return { ...file.toJSON(), avatar: undefined }
  }

  async show ({ params, response }) {
    const file = await File.findByOrFail('uuid', params.id)

    return response.download(Helpers.tmpPath(`files/${file.file}`))
  }
}

module.exports = FileController

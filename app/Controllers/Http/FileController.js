'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const File = use('App/Models/File')

/** @typedef {import('@adonisjs/ignitor/src/Helpers')} Helpers */
const Helpers = use('Helpers')

const Env = use('Env')

const Kue = use('Kue')
const PdfToHtmlJob = use('App/Jobs/PdfToHtml')
const PdfToTextJob = use('App/Jobs/PdfToText')
const PersistFileJob = use('App/Jobs/PersistFile')

const Document = use('App/Schemas/Document')

class FileController {
  async store ({ request, response, auth }) {
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

    await auth.user.load('organization', organization => {
      organization.setVisible(['uuid', 'name', 'initials'])
    })

    const document = await Document.create({
      file: file.toJSON(),
      author: {
        uuid: auth.user.uuid,
        firstname: auth.user.firstname,
        lastname: auth.user.lastname,
        email: auth.user.email
      },
      organization: auth.user.organization
    })

    if (Env.get('NODE_ENV') !== 'testing') {
      Kue.dispatch(PdfToHtmlJob.key, { pathname, htmlpath }, { attempts: 3 })
      Kue.dispatch(PdfToTextJob.key, { pathname, documentId: document._id }, {
        attempts: 3
      })
      Kue.dispatch(PersistFileJob.key, { pathname, filename }, { attempts: 3 })
    }

    return { ...file.toJSON(), avatar: undefined, document_id: document._id }
  }

  async show ({ params, response }) {
    const file = await File.findByOrFail('uuid', params.id)

    return response.download(Helpers.tmpPath(`files/${file.file}`))
  }

  async destroy ({ params }) {
    const { uuid } = await File.findByOrFail('uuid', params.id)
    const document = await Document.findOne({ 'file.uuid': uuid })

    document.canceledAt = new Date()

    await document.save()
  }
}

module.exports = FileController

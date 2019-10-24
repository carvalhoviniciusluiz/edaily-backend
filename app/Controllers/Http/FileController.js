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

const Matter = use('App/Schemas/Matter')

class FileController {
  async store ({ request, auth }) {
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

    const {
      uuid,
      firstname,
      lastname,
      email,
      organization
    } = auth.user.toJSON()

    const matter = await Matter.create({
      file: file.toJSON(),
      author: { uuid, firstname, lastname, email },
      organization
    })

    if (Env.get('NODE_ENV') !== 'testing') {
      Kue.dispatch(PdfToHtmlJob.key, { pathname, htmlpath }, { attempts: 3 })
      Kue.dispatch(PdfToTextJob.key, { pathname, matterId: matter._id }, {
        attempts: 3
      })
      Kue.dispatch(PersistFileJob.key, { pathname, filename }, { attempts: 3 })
    }

    return { ...file.toJSON(), avatar: undefined, matter_id: matter._id }
  }

  async show ({ params, response }) {
    const file = await File.findByOrFail('uuid', params.id)

    return response.download(Helpers.tmpPath(`files/${file.file}`))
  }

  async destroy ({ params }) {
    const { uuid } = await File.findByOrFail('uuid', params.id)
    const matter = await Matter.findOne({ 'file.uuid': uuid })

    matter.canceled_at = new Date()

    await matter.save()
  }
}

module.exports = FileController

'use strict'

const PdfService = use('App/Services/PdfService')

const Matter = use('App/Schemas/Matter')

class PdfToText {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'PdfToText-job'
  }

  async handle ({ pathname, matterId }) {
    const pages = await PdfService.pdfToText(pathname)

    const matter = await Matter.findById(matterId)
    matter.pages = pages

    await matter.save()
  }
}

module.exports = PdfToText

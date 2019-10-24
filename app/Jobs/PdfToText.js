'use strict'

const PdfService = use('App/Services/PdfService')

const Document = use('App/Schemas/Document')

class PdfToText {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'PdfToText-job'
  }

  async handle ({ pathname, documentId }) {
    const pages = await PdfService.pdfToText(pathname)

    const document = await Document.findById(documentId)
    document.pages = pages

    await document.save()
  }
}

module.exports = PdfToText

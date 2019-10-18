'use strict'

const PdfService = use('App/Services/PdfService')

class PdfToHtml {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'PdfToHtml-job'
  }

  async handle ({ pathname, htmlpath }) {
    await PdfService.pdfToHTML(pathname, htmlpath)
  }
}

module.exports = PdfToHtml

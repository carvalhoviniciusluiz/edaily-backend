'use strict'

const PdfService = use('App/Services/PdfService')

class PdfToText {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'PdfToText-job'
  }

  async handle ({ pathname }) {
    const pages = await PdfService.pdfToText(pathname)

    console.log(pages[0])
  }
}

module.exports = PdfToText

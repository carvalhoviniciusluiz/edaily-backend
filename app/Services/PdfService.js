'use strict'

const extract = require('pdf-text-extract')

class PdfService {
  static pdfToText (filePath, options = {}) {
    return new Promise((resolve, reject) => {
      const pdftotextOptions = {
        layout: 'raw',
        splitPages: true
      }
      extract(filePath, { ...pdftotextOptions, ...options }, (err, pages) => {
        if (err) {
          const error = new Error(
            `Error extracting PDF text for file at [[ ${filePath} ]], error: ` +
            err.message
          )
          return reject(error)
        }
        resolve(pages)
      })
    })
  }
}

module.exports = PdfService

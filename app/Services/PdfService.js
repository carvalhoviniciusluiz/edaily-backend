'use strict'
const { execFile } = require('child_process')

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

  static pdfToHTML (filePath, targetDir) {
    return new Promise((resolve, reject) => {
      execFile('pdftohtml', [filePath, targetDir], (err, stdout, stderr) => {
        if (err) {
          const error = new Error('pdftohtml command failed: ' + stderr)
          return reject(error)
        }
        resolve(stdout)
      })
    })
  }
}

module.exports = PdfService

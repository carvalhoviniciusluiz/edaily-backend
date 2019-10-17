'use strict'
const { spawn } = require('child_process')

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
      let output = ''
      let stderr = ''

      const child = spawn('pdftohtml', [filePath, targetDir])
      child.stdout.setEncoding('utf8')
      child.stderr.setEncoding('utf8')
      child.stdout.on('data', data => {
        output += data
      })
      child.stderr.on('data', data => {
        stderr += data
      })
      child.on('close', code => {
        if (code !== 0) {
          reject(new Error('pdftohtml command failed: ' + stderr))
        }
        resolve(output)
      })
    })
  }
}

module.exports = PdfService

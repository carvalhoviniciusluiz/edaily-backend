'use strict'

const fs = require('fs')
const Config = use('Config')

class FileService {
  static get bucket () {
    return Config.get('sqlgrid.bucket')
  }

  // e.g, await FileService.save(pathname, filename)
  static persist (pathname, filename) {
    if (!pathname && !filename) return

    return new Promise((resolve, reject) => {
      try {
        const buffer = fs.readFileSync(pathname)
        const file = FileService.bucket.writeFile({ filename, buffer })
        resolve(file)
      } catch (error) {
        reject(error)
      }
    })
  }

  // e.g, await FileService.fetch({ id })
  static fetch (spec) {
    if (!spec) return

    return new Promise((resolve, reject) => {
      try {
        const file = FileService.bucket.readFile(spec)
        resolve(file)
      } catch (error) {
        reject(error)
      }
    })
  }

  // e.g, await FileService.create({ id }, pathname)
  static create (spec, pathname) {
    if (!spec && !pathname) return

    return new Promise((resolve, reject) => {
      try {
        const readStream = FileService.bucket.createReadStream(spec)
        readStream.pipe(fs.createWriteStream(pathname))
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = FileService

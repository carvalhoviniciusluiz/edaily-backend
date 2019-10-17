'use strict'

const fs = require('fs')
const Config = use('Config')

class BucketService {
  static get bucket () {
    return Config.get('sqlgrid.bucket')
  }

  // e.g, await BucketService.writeFile(pathname, filename)
  static writeFile (pathname, filename) {
    if (!pathname && !filename) return

    return new Promise((resolve, reject) => {
      try {
        const buffer = fs.readFileSync(pathname)
        const writeFile = BucketService.bucket.writeFile({ filename, buffer })
        resolve(writeFile)
      } catch (error) {
        reject(error)
      }
    })
  }

  // e.g, await BucketService.readFile({ id })
  static readFile (spec) {
    if (!spec) return

    return new Promise((resolve, reject) => {
      try {
        const readFile = BucketService.bucket.readFile(spec)
        resolve(readFile)
      } catch (error) {
        reject(error)
      }
    })
  }

  // e.g, await BucketService.createFile({ id }, pathname)
  static createFile (spec, pathname) {
    if (!spec && !pathname) return

    return new Promise((resolve, reject) => {
      try {
        const readStream = BucketService.bucket.createReadStream(spec)
        readStream.pipe(fs.createWriteStream(pathname))
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = BucketService

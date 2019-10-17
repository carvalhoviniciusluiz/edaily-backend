'use strict'

const fs = require('fs')
const Config = use('Config')

class BucketService {
  constructor () {
    this.bucket = Config.get('sqlgrid.bucket')
  }

  // e.g, await BucketService.writeFile(pathname, filename)
  writeFile (pathname, filename) {
    if (!pathname && !filename) return

    return new Promise((resolve, reject) => {
      try {
        const buffer = fs.readFileSync(pathname)
        this.writeFile = this.bucket.writeFile({ filename, buffer })
        resolve(this.writeFile)
      } catch (error) {
        reject(error)
      }
    })
  }

  // e.g, await BucketService.readFile({ id })
  readFile (spec) {
    if (!spec) return

    return new Promise((resolve, reject) => {
      try {
        this.readFile = this.bucket.readFile(spec)
        resolve(this.readFile)
      } catch (error) {
        reject(error)
      }
    })
  }

  // e.g, await BucketService.createFile({ id }, pathname)
  createFile (spec, pathname) {
    if (!spec && !pathname) return

    return new Promise((resolve, reject) => {
      try {
        const readStream = this.bucket.createReadStream(spec)
        readStream.pipe(fs.createWriteStream(pathname))
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = new BucketService()

'use strict'

const FileService = use('App/Services/FileService')

class PersistFile {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'PersistFile-job'
  }

  async handle ({ pathname, filename }) {
    await FileService.persist(pathname, filename)
  }
}

module.exports = PersistFile

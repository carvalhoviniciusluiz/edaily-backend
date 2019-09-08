'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const uuid = require('uuid')

class File extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeSave', async file => {
      if (!file.uuid) {
        file.uuid = uuid.v4()
      }
    })
  }
}

module.exports = File

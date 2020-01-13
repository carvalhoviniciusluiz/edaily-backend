'use strict'

const uuid = require('uuid')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const Env = use('Env')

class File extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeSave', async file => {
      if (!file.uuid) {
        file.uuid = uuid.v4()
      }
    })
  }

  static get computed () {
    return ['avatar', 'url']
  }

  getAvatar ({ uuid }) {
    return `${Env.get('APP_URL')}/avatars/${uuid}`
  }

  getUrl ({ uuid }) {
    return `${Env.get('APP_URL')}/files/${uuid}`
  }
}

module.exports = File

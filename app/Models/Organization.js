'use strict'

const uuid = require('uuid')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Organization extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeSave', async file => {
      if (!file.uuid) {
        file.uuid = uuid.v4()
      }
    })
  }

  static get hidden () {
    return ['id', 'author_id', 'revisor_id', 'file_id', 'created_at']
  }

  author () {
    return this.belongsTo('App/Models/User', 'author_id')
  }

  revisor () {
    return this.belongsTo('App/Models/User', 'revisor_id')
  }

  users () {
    return this.hasMany('App/Models/User')
  }

  file () {
    return this.belongsTo('App/Models/File')
  }
}

module.exports = Organization

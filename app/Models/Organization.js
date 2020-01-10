'use strict'

const uuid = require('uuid')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Organization extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeSave', async organization => {
      if (!organization.uuid) {
        organization.uuid = uuid.v4()
      }
      if (!organization.fingerprint) {
        organization.fingerprint = (Math.random() * (1 - 9) / 2)
          .toString()
          .substr(8, 4)
      }
    })
  }

  static get hidden () {
    return ['id', 'author_id', 'revisor_id', 'created_at']
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
}

module.exports = Organization

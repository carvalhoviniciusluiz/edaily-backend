'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

const uuid = require('uuid')

class User extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeSave', async user => {
      if (!user.uuid) {
        user.uuid = uuid.v4()
      }

      if (user.dirty.password) {
        user.password = await Hash.make(user.password)
      }
    })
  }

  static get hidden () {
    return ['id', 'password', 'created_at', 'token', 'token_created_at']
  }

  tokens () {
    return this.hasMany('App/Models/Token')
  }

  organization () {
    return this.belongsTo('App/Models/Organization')
  }
}

module.exports = User

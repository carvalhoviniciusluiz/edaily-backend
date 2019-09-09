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

    this.addHook('beforeUpdate', 'UserHook.sendAccountModificationEmail')
  }

  static get hidden () {
    return [
      'id',
      'organization_id',
      'password',
      'created_at',
      'token',
      'token_created_at',
      'author_id',
      'revisor_id',
      'avatar_id'
    ]
  }

  tokens () {
    return this.hasMany('App/Models/Token')
  }

  organization () {
    return this.belongsTo('App/Models/Organization')
  }

  avatar () {
    return this.belongsTo('App/Models/File', 'avatar_id')
  }
}

module.exports = User

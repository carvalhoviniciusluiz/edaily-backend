'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeSave', 'UserHook.configurePasswordAndUUID')

    this.addHook('afterUpdate', 'UserHook.sendAccountModificationEmail')
  }

  static get hidden () {
    return [
      'id',
      'organization_id',
      'password',
      'created_at',
      'recovery_token',
      'recovery_token_created_at',
      'confirmation_token',
      'last_sign_in_ip_address',
      'current_sign_in_ip_address',
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

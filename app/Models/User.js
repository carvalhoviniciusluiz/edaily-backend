'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeSave', 'UserHook.configurePasswordAndUUID')

    this.addHook('afterUpdate', 'UserHook.sendAccountModificationEmail')
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

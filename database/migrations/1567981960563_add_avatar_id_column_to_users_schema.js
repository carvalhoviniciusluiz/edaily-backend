'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddAvatarIdColumnToUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table
        .integer('avatar_id')
        .unsigned()
        .references('id')
        .inTable('files')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('avatar_id')
    })
  }
}

module.exports = AddAvatarIdColumnToUsersSchema

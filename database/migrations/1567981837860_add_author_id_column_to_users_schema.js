'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddAuthorIdColumnToUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table
        .integer('author_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('author_id')
    })
  }
}

module.exports = AddAuthorIdColumnToUsersSchema

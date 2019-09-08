'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddRevisorIdColumnToUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table
        .integer('revisor_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('revisor_id')
    })
  }
}

module.exports = AddRevisorIdColumnToUsersSchema

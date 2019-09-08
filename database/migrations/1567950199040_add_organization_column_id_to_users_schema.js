'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddOrganizationIdColumnToUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table
        .integer('organization_id')
        .unsigned()
        .references('id')
        .inTable('organizations')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('organization_id')
    })
  }
}

module.exports = AddOrganizationIdColumnToUsersSchema

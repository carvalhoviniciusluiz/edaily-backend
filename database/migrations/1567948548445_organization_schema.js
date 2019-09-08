'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrganizationSchema extends Schema {
  up () {
    this.create('organizations', (table) => {
      table.increments()
      table.string('uuid').notNullable()
      table.string('name').notNullable()
      table.string('initials').notNullable()
      table.string('cnpj').notNullable().unique()
      table.string('billing_email').notNullable().unique()
      table.string('phone1').notNullable()
      table.string('phone2')
      table
        .integer('file_id')
        .unsigned()
        .references('id')
        .inTable('files')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table
        .integer('author_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table
        .integer('revisor_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.timestamps()
    })
  }

  down () {
    this.drop('organizations')
  }
}

module.exports = OrganizationSchema

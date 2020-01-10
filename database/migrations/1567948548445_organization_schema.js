'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrganizationSchema extends Schema {
  up () {
    this.create('organizations', (table) => {
      table.increments()
      table.string('uuid').notNullable().unique()
      table.string('fingerprint').notNullable().unique()
      table.string('definition').notNullable()
      table.string('name').notNullable()
      table.string('initials').notNullable()
      table.string('cnpj').notNullable().unique()
      table.string('billing_email').notNullable().unique()
      table.string('phone1').notNullable()
      table.string('phone2')
      table.string('zipcode').notNullable()
      table.string('street').notNullable()
      table.string('street_number').notNullable()
      table.string('neighborhood').notNullable()
      table.string('city').notNullable()
      table.string('state').notNullable()
      table.boolean('terms_accepted').default(false)
      table
        .integer('author_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table
        .integer('revisor_id')
        .unsigned()
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

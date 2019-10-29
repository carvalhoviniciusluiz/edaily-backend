'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('uuid').notNullable()
      table.string('firstname').notNullable()
      table.string('lastname').notNullable()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.string('cpf').notNullable().unique()
      table.string('rg').notNullable()
      table.string('phone').notNullable()
      table.string('zipcode').notNullable()
      table.string('street').notNullable()
      table.string('street_number').notNullable()
      table.string('neighborhood').notNullable()
      table.string('city').notNullable()
      table.string('state').notNullable()
      table.boolean('is_responsible').default(false)
      table.boolean('is_active').default(false)
      table.string('recovery_token')
      table.timestamp('recovery_token_created_at')
      table.string('confirmation_token')
      table.timestamp('confirmed_at')
      table.integer('sign_in_count').default(0)
      table.date('last_sign_in_at')
      table.date('current_sign_in_at')
      table.string('last_sign_in_ip_address')
      table.string('current_sign_in_ip_address')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema

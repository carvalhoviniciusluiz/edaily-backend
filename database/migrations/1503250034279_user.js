'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('uuid').notNullable()
      table.string('name').notNullable()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.string('cpf').notNullable().unique()
      table.string('phone').notNullable()
      table.string('recovery_token')
      table.timestamp('recovery_token_created_at')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema

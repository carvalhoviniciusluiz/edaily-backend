'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

const crypto = require('crypto')

const { cnpj } = require('cpf-cnpj-validator')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

Factory.genToken = (size = 32) => crypto.randomBytes(size).toString('hex')

Factory.blueprint('App/Models/User', (faker, i, data = {}) => {
  return {
    name: faker.name(),
    email: faker.email(),
    password: faker.string(),
    cpf: faker.cpf(),
    phone: faker.phone(),
    ...data
  }
})

Factory.blueprint('App/Models/Organization', async (faker, i, data = {}) => {
  const user = await Factory.model('App/Models/User').create()

  return {
    name: faker.company(),
    initials: faker.word(),
    cnpj: cnpj.generate(),
    billing_email: faker.email(),
    phone1: faker.phone(),
    phone2: faker.phone(),
    author_id: user.id,
    revisor_id: user.id,
    ...data
  }
})

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
    firstname: faker.first(),
    lastname: faker.last(),
    email: faker.email(),
    password: faker.string(),
    cpf: faker.cpf(),
    rg: faker.string(),
    phone: faker.phone(),
    zipcode: faker.zip(),
    street: faker.street(),
    street_number: faker.postal(),
    neighborhood: faker.province({ full: true }),
    city: faker.city(),
    state: faker.state(),
    ...data
  }
})

Factory.blueprint('App/Models/Organization', async (faker, i, data = {}) => {
  const user = await Factory.model('App/Models/User').create()

  return {
    definition: faker.string(),
    name: faker.company(),
    initials: faker.string(),
    fingerprint: (Math.random() * (1 - 9) / 2).toString().substr(8, 4),
    cnpj: cnpj.generate(),
    billing_email: faker.email(),
    phone1: faker.phone(),
    phone2: faker.phone(),
    author_id: user.id,
    revisor_id: user.id,
    zipcode: faker.zip(),
    street: faker.street(),
    street_number: faker.postal(),
    neighborhood: faker.province({ full: true }),
    city: faker.city(),
    state: faker.state(),
    ...data
  }
})

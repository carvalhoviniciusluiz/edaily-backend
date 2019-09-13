const setup = require('../setup')

const { test, trait, before } = use('Test/Suite')('Organizations')

trait('Test/ApiClient')
trait('Auth/Client')
trait(setup)

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

before(async () => {
  await Organization.truncate()
})

test('deve retornar uma lista vazia', async ({ user, client, assert }) => {
  const response = await client
    .get('organizations')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.total, '0')
})

test('deve retornar uma lista não vazia', async ({ user, client, assert }) => {
  await Factory.model('App/Models/Organization').create()

  const response = await client
    .get('organizations')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.total, '1')
})

test('deve retornar uma lista paginada', async ({ user, client, assert }) => {
  await Factory.model('App/Models/Organization').create()
  await Factory.model('App/Models/Organization').create()
  await Factory.model('App/Models/Organization').create()

  const response = await client
    .get('organizations?limit=1')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.data.length, 1)
})

test('deve cadastrar uma oganização', async ({ user, client, assert }) => {
  const organization = await Factory.model('App/Models/Organization').make()

  const response = await client
    .post('organizations')
    .loginVia(user, 'jwt')
    .send(organization.toJSON())
    .end()

  response.assertStatus(200)
  assert.exists(response.body.uuid)
})

test('deve retornar uma oganização', async ({ user, client, assert }) => {
  const { uuid } = await Factory.model('App/Models/Organization').create()

  const response = await client
    .get(`organizations/${uuid}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.exists(response.body.uuid)
})

test('deve atualizar uma oganização', async ({ user, client, assert }) => {
  const { uuid } = await Factory.model('App/Models/Organization').create()

  const response = await client
    .put(`organizations/${uuid}`)
    .loginVia(user, 'jwt')
    .send({
      name: 'xpto'
    })
    .end()

  response.assertStatus(200)
  assert.equal(response.body.name, 'xpto')
})

test('deve deletar uma oganização', async ({ user, client }) => {
  const { uuid } = await Factory.model('App/Models/Organization').create()

  const response = await client
    .delete(`organizations/${uuid}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(204)
})

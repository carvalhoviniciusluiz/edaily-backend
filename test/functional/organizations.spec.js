const setup = require('../setup')

const { test, trait } = use('Test/Suite')('Organization')

trait('Test/ApiClient')
trait('Auth/Client')
trait(setup)

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

test('deve retornar uma lista vazia', async ({ user, client, assert }) => {
  const response = await client
    .get('organizations')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.isEmpty(response.body)
})

test('deve retornar uma lista não vazia', async ({ user, client, assert }) => {
  await Factory.model('App/Models/Organization').create()

  const response = await client
    .get('organizations')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.length, 1)
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

test('deve deletar uma oganização', async ({ user, client, assert }) => {
  const { uuid } = await Factory.model('App/Models/Organization').create()

  const response = await client
    .delete(`organizations/${uuid}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(204)
})

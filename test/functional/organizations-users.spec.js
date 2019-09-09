const setup = require('../setup')

const { test, trait, before } = use('Test/Suite')('Organization Users')

trait('Test/ApiClient')
trait('Auth/Client')
trait(setup)

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

let id
let uuid

before(async () => {
  await Organization.truncate()

  const organization = await Factory.model('App/Models/Organization').create()
  id = organization.id
  uuid = organization.uuid
})

test('deve retornar uma lista vazia', async ({ user, client, assert }) => {
  const response = await client
    .get(`organizations/${uuid}/users`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.total, '0')
})

test('deve retornar uma lista não vazia', async ({ user, client, assert }) => {
  await Factory.model('App/Models/User').create({ organization_id: id })

  const response = await client
    .get(`organizations/${uuid}/users`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.total, '1')
})

test('deve retornar uma lista paginada', async ({ user, client, assert }) => {
  await Factory.model('App/Models/User').create({ organization_id: id })
  await Factory.model('App/Models/User').create({ organization_id: id })
  await Factory.model('App/Models/User').create({ organization_id: id })
  await Factory.model('App/Models/User').create({ organization_id: id })

  const response = await client
    .get(`organizations/${uuid}/users?limit=1`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.data.length, 1)
})

test('deve cadastrar um usuário', async ({ user, client, assert }) => {
  const newUser = await Factory.model('App/Models/User').make()

  const response = await client
    .post(`organizations/${uuid}/users`)
    .loginVia(user, 'jwt')
    .send(newUser.toJSON())
    .end()

  response.assertStatus(200)
  assert.exists(response.body.uuid)
})

test('deve retornar um usuário', async ({ user, client, assert }) => {
  const { uuid: userId } = await Factory
    .model('App/Models/User')
    .create({ organization_id: id })

  const response = await client
    .get(`organizations/${uuid}/users/${userId}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.exists(response.body.uuid)
})

test('deve atualizar um usuário', async ({ user, client, assert }) => {
  const { uuid: userId } = await Factory
    .model('App/Models/User')
    .create({ organization_id: id })

  const response = await client
    .put(`organizations/${uuid}/users/${userId}`)
    .loginVia(user, 'jwt')
    .send({
      name: 'xpto'
    })
    .end()

  response.assertStatus(200)
  assert.equal(response.body.name, 'xpto')
})

test('deve deletar um usuário', async ({ user, client, assert }) => {
  const { uuid: userId } = await Factory
    .model('App/Models/User')
    .create({ organization_id: id })

  const response = await client
    .delete(`organizations/${uuid}/users/${userId}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(204)
})

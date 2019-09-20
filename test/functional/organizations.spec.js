const { test, trait, before } = use('Test/Suite')('Organizations')

trait('Test/ApiClient')
trait('Auth/Client')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

before(async () => {
  await Organization.truncate()
})

test('deve retornar uma lista vazia', async ({ client, assert }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  const response = await client
    .get('organizations')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.total, '0')
})

test('deve retornar uma lista não vazia', async ({ client, assert }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  await Factory.model('App/Models/Organization').create()

  const response = await client
    .get('organizations')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.total, '1')
})

test('deve retornar uma lista paginada', async ({ client, assert }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

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

test('(PUBLICA ROUTE) deve cadastrar uma oganização', async ({ client, assert }) => {
  const responsible = (
    await Factory.model('App/Models/User').make()
  ).toJSON()

  const company = (
    await Factory.model('App/Models/Organization').make()
  ).toJSON()

  const response = await client
    .post('organizations')
    .send({
      company,
      responsible
    })
    .end()

  response.assertStatus(200)
  assert.exists(response.body.uuid)
})

test('deve retornar uma oganização', async ({ client, assert }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  const { uuid } = await Factory
    .model('App/Models/Organization')
    .create()

  const response = await client
    .get(`organizations/${uuid}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.exists(response.body.uuid)
})

test('deve atualizar uma oganização', async ({ client, assert }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  const { uuid } = await Factory
    .model('App/Models/Organization')
    .create()

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

test('deve deletar uma oganização', async ({ client }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  const { uuid } = await Factory
    .model('App/Models/Organization')
    .create()

  const response = await client
    .delete(`organizations/${uuid}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(204)
})

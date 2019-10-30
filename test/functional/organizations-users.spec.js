const { test, trait, before, after } = use('Test/Suite')('Organization Users')

trait('Test/ApiClient')
trait('Auth/Client')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')
const Organization = use('App/Models/Organization')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

before(async () => {
  await User.truncate()
  await Organization.truncate()
})

after(async () => {
  await User.truncate()
  await Organization.truncate()
})

test('deve retornar uma lista vazia', async ({ client, assert }) => {
  const { uuid } = await Factory.model('App/Models/Organization').create()
  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .get(`organizations/${uuid}/users`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.total, '0')
})

test('deve retornar uma lista não vazia', async ({ client, assert }) => {
  const { id, uuid } = await Factory.model('App/Models/Organization').create()
  const user = await Factory.model('App/Models/User').create({
    organization_id: id
  })

  const response = await client
    .get(`organizations/${uuid}/users`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.total, '1')
})

test('deve retornar uma lista paginada', async ({ client, assert }) => {
  const { id, uuid } = await Factory.model('App/Models/Organization').create()
  await Factory.model('App/Models/User').create({ organization_id: id })
  await Factory.model('App/Models/User').create({ organization_id: id })
  await Factory.model('App/Models/User').create({ organization_id: id })
  await Factory.model('App/Models/User').create({ organization_id: id })

  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .get(`organizations/${uuid}/users?limit=1`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.data.length, 1)
})

test('deve cadastrar um usuário', async ({ client, assert }) => {
  const { uuid } = await Factory.model('App/Models/Organization').create()
  const user = await Factory.model('App/Models/User').create()
  const newUser = await Factory.model('App/Models/User').make()

  const response = await client
    .post(`organizations/${uuid}/users`)
    .loginVia(user, 'jwt')
    .send(newUser.toJSON())
    .end()

  response.assertStatus(200)
  assert.exists(response.body.uuid)
})

test('deve retornar um usuário', async ({ client, assert }) => {
  const { id, uuid } = await Factory.model('App/Models/Organization').create()
  const { uuid: userId } = await Factory.model('App/Models/User').create({
    organization_id: id
  })

  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .get(`organizations/${uuid}/users/${userId}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.exists(response.body.uuid)
})

test('deve retornar usuário sem organização', async ({ client, assert }) => {
  const { id, uuid } = await Factory.model('App/Models/Organization').create()
  const { uuid: userId } = await Factory.model('App/Models/User').create({
    organization_id: id
  })

  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .get(`organizations/${uuid}/users/${userId}?organization=false`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.notExists(response.body.organization)
})

test('deve atualizar um usuário', async ({ client, assert }) => {
  const { id, uuid } = await Factory.model('App/Models/Organization').create()
  const { uuid: userId } = await Factory.model('App/Models/User').create({
    organization_id: id
  })

  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .put(`organizations/${uuid}/users/${userId}`)
    .loginVia(user, 'jwt')
    .send({
      firstname: 'vinicius',
      lastname: 'carvalho'
    })
    .end()

  response.assertStatus(200)
  assert.equal(response.body.firstname, 'vinicius')
  assert.equal(response.body.lastname, 'carvalho')
})

test('deve deletar um usuário', async ({ client }) => {
  const { id, uuid } = await Factory.model('App/Models/Organization').create()
  const { uuid: userId } = await Factory.model('App/Models/User').create({
    organization_id: id
  })

  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .delete(`organizations/${uuid}/users/${userId}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(204)
})

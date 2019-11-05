const { test, trait, before, after } = use('Test/Suite')('Document Follow')

trait('Test/ApiClient')
trait('Auth/Client')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Document = use('App/Schemas/Document')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const Helpers = use('Helpers')

before(async () => {
  await User.truncate()
  await Document.deleteMany()
})
after(async () => {
  await User.truncate()
  await Document.deleteMany()
})

test('deve retornar usuário sem vinculo', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .get('documents/following')
    .loginVia(user, 'jwt')
    .end()

  assert.deepEqual(response.body, { erro: { message: 'Usuário sem vinculo' } })
  response.assertStatus(400)
})

test('deve retornar uma lista vazia', async ({ client, assert }) => {
  const organization = await Factory.model('App/Models/Organization').create()

  const user = await Factory.model('App/Models/User').create({
    organization_id: organization.id
  })

  const response = await client
    .get('documents/following')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.total, '0')
})

test('deve retornar uma lista não vazia', async ({ client, assert }) => {
  const organization = await Factory.model('App/Models/Organization').create()

  const user = await Factory.model('App/Models/User').create({
    organization_id: organization.id
  })

  const { body: { document_id: id } } = await client
    .post('files')
    .loginVia(user, 'jwt')
    .attach('file', Helpers.tmpPath('helloworld.pdf'))
    .end()

  await client
    .put(`documents/${id}/forward`)
    .loginVia(user, 'jwt')
    .end()

  const response = await client
    .get('documents/following')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.total, '1')
})

test('deve retornar um documento específico', async ({ client, assert }) => {
  const organization = await Factory.model('App/Models/Organization').create()

  const user = await Factory.model('App/Models/User').create({
    organization_id: organization.id
  })

  const { body: { document_id: id } } = await client
    .post('files')
    .loginVia(user, 'jwt')
    .attach('file', Helpers.tmpPath('helloworld.pdf'))
    .end()

  const response = await client
    .get(`documents/${id}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.isNotNull(response.body._id)
})

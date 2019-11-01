const { test, trait, before, after } = use('Test/Suite')('Document Review')

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
    .get('documents')
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
    .get('documents')
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

  await Document.deleteMany()

  await client
    .post('files')
    .loginVia(user, 'jwt')
    .attach('file', Helpers.tmpPath('helloworld.pdf'))
    .end()

  const response = await client
    .get('documents')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.total, '1')
})

test('deve retornar uma lista paginada', async ({ client, assert }) => {
  const organization = await Factory.model('App/Models/Organization').create()

  const user = await Factory.model('App/Models/User').create({
    organization_id: organization.id
  })

  await client
    .post('files')
    .loginVia(user, 'jwt')
    .attach('file', Helpers.tmpPath('helloworld.pdf'))
    .end()

  await client
    .post('files')
    .loginVia(user, 'jwt')
    .attach('file', Helpers.tmpPath('helloworld.pdf'))
    .end()

  await client
    .post('files')
    .loginVia(user, 'jwt')
    .attach('file', Helpers.tmpPath('helloworld.pdf'))
    .end()

  const response = await client
    .get('documents?limit=1')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.data.length, 1)
})

test('deve encaminhar matéria', async ({ client, assert }) => {
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
    .put(`documents/${id}/forward`)
    .loginVia(user, 'jwt')
    .end()

  const document = await Document.findById(id)

  response.assertStatus(204)
  assert.equal(document.responsable.uuid, user.uuid)
  assert.equal(document.responsable.firstname, user.firstname)
  assert.equal(document.responsable.lastname, user.lastname)
  assert.equal(document.responsable.email, user.email)
  assert.exists(document.forwardedAt)
})

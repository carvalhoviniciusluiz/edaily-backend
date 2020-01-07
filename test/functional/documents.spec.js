const { test, trait, before, after } = use('Test/Suite')('Document')

trait('Test/ApiClient')
trait('Auth/Client')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Document = use('App/Models/Schemas/Document')

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

test('deve retornar uma lista vazia', async ({ client, assert }) => {
  const organization = await Factory.model('App/Models/Organization').create()

  const user = await Factory.model('App/Models/User').create({
    organization_id: organization.id
  })

  const response = await client
    .get(`organizations/${organization.uuid}/users/${user.uuid}/documents`)
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
    .get(`organizations/${organization.uuid}/users/${user.uuid}/documents`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.total, '1')
})

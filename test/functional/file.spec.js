const { test, trait, before, after } = use('Test/Suite')('File')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const Helpers = use('Helpers')

const Document = use('App/Models/Schemas/Document')

trait('Test/ApiClient')
trait('Auth/Client')

before(async () => {
  await Document.deleteMany()
})
after(async () => {
  await Document.deleteMany()
})

test('deve poder fazer upload de arquivo', async ({ assert, client }) => {
  const { id } = await Factory.model('App/Models/Organization').create()
  const user = await Factory.model('App/Models/User').create({
    organization_id: id
  })

  const response = await client
    .post('/files')
    .loginVia(user, 'jwt')
    .attach('file', Helpers.tmpPath('helloworld.pdf'))
    .end()

  response.assertStatus(200)
  assert.exists(response.body.url)
  assert.exists(response.body.document_uuid)
})

test('deve poder cancelar um arquivo', async ({ assert, client }) => {
  const { id } = await Factory.model('App/Models/Organization').create()
  const user = await Factory.model('App/Models/User').create({
    organization_id: id
  })

  const { body } = await client
    .post('/files')
    .loginVia(user, 'jwt')
    .attach('file', Helpers.tmpPath('helloworld.pdf'))
    .end()

  const response = await client
    .delete(`/files/${body.uuid}`)
    .loginVia(user, 'jwt')
    .end()

  const document = await Document.findOne({ uuid: body.document_uuid })

  response.assertStatus(204)
  assert.exists(document.cancellation.canceledAt)
  assert.equal(document.cancellation.author.uuid, user.uuid)
})

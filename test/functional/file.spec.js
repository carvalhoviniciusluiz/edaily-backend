const { test, trait, before, after } = use('Test/Suite')('File')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const Helpers = use('Helpers')

const Matter = use('App/Schemas/Matter')

trait('Test/ApiClient')
trait('Auth/Client')

before(async () => {
  await Matter.deleteMany()
})
after(async () => {
  await Matter.deleteMany()
})

test('deve poder fazer upload de avatar', async ({ assert, client }) => {
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

  response.assertStatus(204)
})

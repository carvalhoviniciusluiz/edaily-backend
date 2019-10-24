const { test, trait, before, after } = use('Test/Suite')('Matter')

trait('Test/ApiClient')
trait('Auth/Client')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Matter = use('App/Schemas/Matter')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const Helpers = use('Helpers')

before(async () => {
  await User.truncate()
  await Matter.deleteMany()
})
after(async () => {
  await User.truncate()
  await Matter.deleteMany()
})

test('deve retornar uma lista vazia', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .get('matters')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.total, '0')
})

test('deve retornar uma lista não vazia', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create()

  await client
    .post('files')
    .loginVia(user, 'jwt')
    .attach('file', Helpers.tmpPath('helloworld.pdf'))
    .end()

  const response = await client
    .get('matters')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.total, '1')
})

test('deve retornar uma lista paginada', async ({ client, assert }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

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
    .get('matters?limit=1')
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

  const { body: { matter_id: id } } = await client
    .post('files')
    .loginVia(user, 'jwt')
    .attach('file', Helpers.tmpPath('helloworld.pdf'))
    .end()

  const response = await client
    .put(`matters/${id}/forward`)
    .loginVia(user, 'jwt')
    .end()

  const matter = await Matter.findById(id)

  response.assertStatus(204)
  assert.equal(matter.responsable.uuid, user.uuid)
  assert.equal(matter.responsable.firstname, user.firstname)
  assert.equal(matter.responsable.lastname, user.lastname)
  assert.equal(matter.responsable.email, user.email)
  assert.isNotNull(matter.forwarded_at)
})

const setup = require('../setup')

const { test, trait } = use('Test/Suite')('Users')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')
trait(setup)

test('deve criar um usuário', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').make()

  const response = await client
    .post('/users')
    .send(user.toJSON())
    .end()

  response.assertStatus(200)
  assert.exists(response.body.uuid)
})

test('deve atualizar o perfil', async ({ user, assert, client }) => {
  const response = await client
    .put('/users')
    .loginVia(user, 'jwt')
    .send({
      name: 'vinicius carvalho',
      email: user.email
    })
    .end()

  response.assertStatus(200)
  assert.equal(response.body.name, 'vinicius carvalho')
})

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

test('deve informar o password', async ({ user, assert, client }) => {
  const response = await client
    .put('/users')
    .loginVia(user, 'jwt')
    .send({
      old_password: '123123'
    })
    .end()

  assert.include(response.body[0], {
    message: 'O password é necessário quando o old_password existe.',
    field: 'password',
    validation: 'requiredIf'
  })

  response.assertStatus(400)
})

test('deve informar o confirmed', async ({ user, assert, client }) => {
  const response = await client
    .put('/users')
    .loginVia(user, 'jwt')
    .send({
      old_password: '123123',
      password: '123123'
    })
    .end()

  assert.include(response.body[0], {
    message: 'A confirmação do password não corresponde.',
    field: 'password',
    validation: 'confirmed'
  })

  response.assertStatus(400)
})

test('deve informar a confirmação certa', async ({ user, assert, client }) => {
  const response = await client
    .put('/users')
    .loginVia(user, 'jwt')
    .send({
      old_password: '123123',
      password: '123123',
      password_confirmation: '321321'
    })
    .end()

  assert.include(response.body[0], {
    message: 'A confirmação do password não corresponde.',
    field: 'password',
    validation: 'confirmed'
  })

  response.assertStatus(400)
})

test('deve informar o password certo', async ({ user, assert, client }) => {
  const response = await client
    .put('/users')
    .loginVia(user, 'jwt')
    .send({
      old_password: '999999',
      password: '123123',
      password_confirmation: '123123'
    })
    .end()

  assert.deepEqual(response.body, { erro: { message: 'Dados inválidos.' } })

  response.assertStatus(401)
})

test('deve atualizar a senha', async ({ user, assert, client }) => {
  const response = await client
    .put('/users')
    .loginVia(user, 'jwt')
    .send({
      old_password: '123456',
      password: '123123',
      password_confirmation: '123123'
    })
    .end()

  response.assertStatus(200)
})

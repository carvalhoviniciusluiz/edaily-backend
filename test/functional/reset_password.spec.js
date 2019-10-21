const { test, trait, before, after } = use('Test/Suite')('Reset Password')

const { subHours, format } = require('date-fns')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

trait('Test/ApiClient')

before(async () => {
  await User.truncate()
})

after(async () => {
  await User.truncate()
})

test('deve confirmação a senha', async ({ client }) => {
  await Factory
    .model('App/Models/User')
    .create({
      recovery_token: '12345',
      recovery_token_created_at: new Date()
    })

  const response = await client
    .post('/reset_password')
    .send({
      recovery_token: '54321',
      password: '123321'
    })
    .end()

  response.assertStatus(400)
})

test('deve informar se o token não existir', async ({ assert, client }) => {
  await Factory
    .model('App/Models/User')
    .create({
      recovery_token: '12345',
      recovery_token_created_at: new Date()
    })

  const response = await client
    .post('/reset_password')
    .send({
      recovery_token: '54321',
      password: '123321',
      password_confirmation: '123321'
    })
    .end()

  response.assertStatus(400)
  assert.include(response.body[0], {
    message: 'O recovery_token não existe.',
    field: 'recovery_token',
    validation: 'exists'
  })
})

test('deve resetar a senha', async ({ client }) => {
  const resetPasswordPayload = {
    recovery_token: Factory.genToken()
  }

  await Factory
    .model('App/Models/User')
    .create({
      ...resetPasswordPayload,
      recovery_token_created_at: new Date()
    })

  const response = await client
    .post('/reset_password')
    .send({
      ...resetPasswordPayload,
      password: '123321',
      password_confirmation: '123321'
    })
    .end()

  response.assertStatus(204)
})

test('deve expirar o token após 2h', async ({ client }) => {
  const resetPasswordPayload = {
    recovery_token: Factory.genToken()
  }

  const dateWithSub = format(subHours(new Date(), 2), 'yyyy-MM-dd HH:ii:ss')

  await Factory
    .model('App/Models/User')
    .create({
      ...resetPasswordPayload,
      recovery_token_created_at: dateWithSub
    })

  const response = await client
    .post('/reset_password')
    .send({
      ...resetPasswordPayload,
      password: '123321',
      password_confirmation: '123321'
    })
    .end()

  response.assertStatus(400)
})

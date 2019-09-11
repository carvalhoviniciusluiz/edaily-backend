const crypto = require('crypto')

const { test, trait } = use('Test/Suite')('Reset Password')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

trait('Test/ApiClient')

test('deve confirmação a senha', async ({ assert, client }) => {
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

test('deve informar se o token estiver errado', async ({ assert, client }) => {
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

  response.assertStatus(404)
})

test('deve informar caso token expirado', async ({ assert, client }) => {
  const resetPasswordPayload = {
    recovery_token: crypto.randomBytes(10).toString('hex')
  }

  await Factory
    .model('App/Models/User')
    .create({
      ...resetPasswordPayload,
      recovery_token_created_at: new Date('December 25, 1995 23:15:30')
    })

  const response = await client
    .post('/reset_password')
    .send({
      ...resetPasswordPayload,
      password: '123321',
      password_confirmation: '123321'
    })
    .end()

  response.assertStatus(401)
})

test('deve resetar a senha', async ({ client }) => {
  const resetPasswordPayload = {
    recovery_token: crypto.randomBytes(10).toString('hex')
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

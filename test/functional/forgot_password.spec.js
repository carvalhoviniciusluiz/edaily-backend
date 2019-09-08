const crypto = require('crypto')

const { test, trait } = use('Test/Suite')('ForgotPassword')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

trait('Test/ApiClient')

test('deve informar quando não redirecionar', async ({ assert, client }) => {
  const response = await client
    .post('/forgot_password')
    .send({
      email: 'carvalho.viniciusluiz@gmail.com'
    })
    .end()

  response.assertStatus(500)
  assert.equal(response.text,
    '{"error":{"message":"Algo deu errado ao redirecionar a página."}}')
})

test('deve informar quando o email não existir', async ({ assert, client }) => {
  const response = await client
    .post('/forgot_password')
    .send({
      email: 'carvalho.viniciusluiz@gmail.com',
      redirect_url: 'htp://www.meusite.com'
    })
    .end()

  response.assertStatus(404)
  assert.equal(response.text,
    '{"error":{"message":"Algo não deu certo, esse e-mail existe?"}}')
})

test('deve retornar 204 para email enviado', async ({ client }) => {
  const forgotPasswordPayload = {
    email: 'carvalho.viniciusluiz@gmail.com'
  }

  await Factory
    .model('App/Models/User')
    .create({ ...forgotPasswordPayload })

  const response = await client
    .post('/forgot_password')
    .send({
      ...forgotPasswordPayload,
      redirect_url: 'htp://www.meusite.com'
    })
    .end()

  response.assertStatus(204)
})

test('deve informar se o token estiver errado', async ({ assert, client }) => {
  await Factory
    .model('App/Models/User')
    .create({
      token: '12345',
      token_created_at: new Date()
    })

  const response = await client
    .put('/forgot_password')
    .send({
      token: '54321',
      password: '123321'
    })
    .end()

  response.assertStatus(404)
  assert.equal(response.text,
    '{"error":{"message":"Algo deu errado ao resetar sua senha."}}')
})

test('deve informar caso token expirado', async ({ assert, client }) => {
  const sessionPayload = {
    token: crypto.randomBytes(10).toString('hex')
  }

  await Factory
    .model('App/Models/User')
    .create({
      ...sessionPayload,
      token_created_at: new Date('December 25, 1995 23:15:30')
    })

  const response = await client
    .put('/forgot_password')
    .send({
      ...sessionPayload,
      password: '123321'
    })
    .end()

  response.assertStatus(401)
  assert.equal(response.text,
    '{"error":{"message":"O token de recuperação está expirado."}}')
})

test('deve resetar a senha', async ({ client }) => {
  const sessionPayload = {
    token: crypto.randomBytes(10).toString('hex')
  }

  await Factory
    .model('App/Models/User')
    .create({
      ...sessionPayload,
      token_created_at: new Date()
    })

  const response = await client
    .put('/forgot_password')
    .send({
      ...sessionPayload,
      password: '123321'
    })
    .end()

  response.assertStatus(204)
})

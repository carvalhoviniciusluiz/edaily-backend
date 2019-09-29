const { test, trait } = use('Test/Suite')('Forgot Password')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

trait('Test/ApiClient')

test('deve informar quando não redirecionar', async ({ client }) => {
  const response = await client
    .post('/forgot_password')
    .send({
      email: 'carvalho.viniciusluiz@gmail.com'
    })
    .end()

  response.assertStatus(400)
})

test('deve informar quando o email não existir', async ({ assert, client }) => {
  const response = await client
    .post('/forgot_password')
    .send({
      email: 'carvalho.viniciusluiz@gmail.com',
      redirect_url: 'http://www.meusite.com'
    })
    .end()

  response.assertStatus(400)
  assert.include(response.body[0], {
    message: 'O email não existe.',
    field: 'email',
    validation: 'exists'
  })
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
      redirect_url: 'http://www.meusite.com'
    })
    .end()

  response.assertStatus(204)
})

const { test, trait } = use('Test/Suite')('Sessions')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

trait('Test/ApiClient')

test('deve retornar uma mensagem para email que não existirem', async ({ assert, client }) => {
  const response = await client
    .post('/forgot_password')
    .send({
      email: 'carvalho.viniciusluiz@gmail.com'
    })
    .end()

  response.assertStatus(404)
  assert.exists({
    error: {
      message: 'Algo não deu certo, esse e-mail existe?'
    }
  })
})

test('deve deve informar um email pare recuperação de senha', async ({ assert, client }) => {
  const forgotPasswordPayload = {
    email: 'carvalho.viniciusluiz@gmail.com'
  }

  await Factory
    .model('App/Models/User')
    .create(forgotPasswordPayload)

  const response = await client
    .post('/forgot_password')
    .send(forgotPasswordPayload)
    .end()

  response.assertStatus(204)
})

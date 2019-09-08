const { test, trait } = use('Test/Suite')('ForgotPassword')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

trait('Test/ApiClient')

test('deve retornar uma mensagem de aviso', async ({ assert, client }) => {
  const response = await client
    .post('/forgot_password')
    .send({
      email: 'carvalho.viniciusluiz@gmail.com'
    })
    .end()

  response.assertStatus(500)
  assert.exists({
    error: {
      message: 'Algo não deu certo, contate o administrador do sistema.'
    }
  })
})

test('deve retornar uma mensagem para email que não existirem', async ({ assert, client }) => {
  const response = await client
    .post('/forgot_password')
    .send({
      email: 'carvalho.viniciusluiz@gmail.com',
      redirect_url: 'htp://www.meusite.com'
    })
    .end()

  response.assertStatus(404)
  assert.exists({
    error: {
      message: 'Algo não deu certo, esse e-mail existe?'
    }
  })
})

test('deve retornar 204 para email enviado', async ({ assert, client }) => {
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

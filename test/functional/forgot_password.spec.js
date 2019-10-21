const { test, trait, before, after } = use('Test/Suite')('Forgot Password')

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

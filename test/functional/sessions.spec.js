const { test, trait } = use('Test/Suite')('Sessions')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

trait('Test/ApiClient')

test('deve retornar um token JWT quando criar a sessão', async ({ assert, client }) => {
  const sessionPayload = {
    cpf: '78545870272',
    password: '123456'
  }

  await Factory
    .model('App/Models/User')
    .create(sessionPayload)

  const response = await client
    .post('/sessions')
    .send(sessionPayload)
    .end()

  response.assertStatus(200)
  assert.exists(response.body.token)
})

const { test, trait } = use('Test/Suite')('Sessions')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

trait('Test/ApiClient')

test('deve retornar um token JWT', async ({ assert, client }) => {
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

  const user = await User.findByOrFail('cpf', sessionPayload.cpf)

  assert.isNull(user.last_sign_in_at)
  assert.isNull(user.last_sign_in_ip_address)
  assert.isNotNull(user.sign_in_count)
  assert.isNotNull(user.current_sign_in_at)
  assert.isNotNull(user.current_sign_in_ip_address)
  assert.isNotNull(response.body.token)
  response.assertStatus(200)
})

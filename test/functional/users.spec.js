const { test, trait } = use('Test/Suite')('Users')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

trait('Test/ApiClient')

test('deve criar um usuário', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').make()

  const response = await client
    .post('/users')
    .send(user.toJSON())
    .end()

  response.assertStatus(200)
  assert.exists(response.body.uuid)
})

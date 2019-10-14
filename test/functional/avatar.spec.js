const { test, trait } = use('Test/Suite')('Avatar')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const Helpers = use('Helpers')

trait('Test/ApiClient')
trait('Auth/Client')

test('deve poder fazer upload de avatar', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .post('/avatars')
    .loginVia(user, 'jwt')
    .attach('file', Helpers.tmpPath('avatar.jpeg'))
    .end()

  response.assertStatus(200)
  assert.exists(response.body.avatar)
})

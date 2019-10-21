const { test, trait, before, after } = use('Test/Suite')('Avatar')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const Helpers = use('Helpers')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

trait('Test/ApiClient')
trait('Auth/Client')

before(async () => {
  await User.truncate()
})

after(async () => {
  await User.truncate()
})

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

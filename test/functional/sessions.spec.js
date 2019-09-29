const { test, trait } = use('Test/Suite')('Sessions')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

trait('Test/ApiClient')

test('deve retornar status 401', async ({ assert, client }) => {
  const usr = await Factory
    .model('App/Models/User')
    .create()

  const response = await client
    .post('/sessions')
    .send({
      credential: usr.cpf,
      password: '123123'
    })
    .end()

  response.assertStatus(401)
})

test('deve logar o cpf e retornar um token', async ({ assert, client }) => {
  const sessionPayload = {
    password: '123456'
  }

  const usr = await Factory
    .model('App/Models/User')
    .create(sessionPayload)

  const response = await client
    .post('/sessions')
    .send({
      credential: usr.cpf,
      password: sessionPayload.password
    })
    .end()

  const user = await User.findByOrFail('cpf', usr.cpf)

  assert.isNull(user.last_sign_in_at)
  assert.isNull(user.last_sign_in_ip_address)
  assert.isNotNull(user.sign_in_count)
  assert.isNotNull(user.current_sign_in_at)
  assert.isNotNull(user.current_sign_in_ip_address)
  assert.isNotNull(response.body.token)
  response.assertStatus(200)
})

test('deve logar o email e retornar um token', async ({ assert, client }) => {
  const sessionPayload = {
    password: '123456'
  }

  const usr = await Factory
    .model('App/Models/User')
    .create(sessionPayload)

  const response = await client
    .post('/sessions')
    .send({
      credential: usr.email,
      password: sessionPayload.password
    })
    .end()

  assert.isNotNull(response.body.token)
  response.assertStatus(200)
})

test('deve retornar o usuário e a organização', async ({ assert, client }) => {
  const sessionPayload = {
    password: '123456'
  }

  const { id } = await Factory.model('App/Models/Organization').create()

  const usr = await Factory
    .model('App/Models/User')
    .create({
      ...sessionPayload,
      organization_id: id
    })

  const response = await client
    .post('/sessions')
    .send({
      credential: usr.email,
      password: sessionPayload.password
    })
    .end()

  assert.isNotNull(response.body.user)
  assert.isNotNull(response.body.user.uuid)
  assert.isNotNull(response.body.user.organization)
  assert.isNotNull(response.body.user.organization.uuid)
  response.assertStatus(200)
})

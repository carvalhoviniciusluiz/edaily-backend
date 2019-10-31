const { test, trait, before, after } = use('Test/Suite')('Sessions')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

trait('Test/ApiClient')

before(async () => {
  await User.truncate()
})

after(async () => {
  await User.truncate()
})

// test('deve retornar status 401', async ({ client }) => {
//   const user = await Factory.model('App/Models/User').create()

//   const response = await client
//     .post('/sessions')
//     .send({
//       credential: user.cpf,
//       password: '123123'
//     })
//     .end()

//   response.assertStatus(401)
// })

test('deve descredenciar usuário inativo', async ({ assert, client }) => {
  const sessionPayload = {
    password: '123456'
  }

  const user = await Factory.model('App/Models/User').create(sessionPayload)

  const response = await client
    .post('/sessions')
    .send({
      credential: user.cpf,
      password: sessionPayload.password
    })
    .end()

  response.assertStatus(401)
})

test('deve logar o cpf e retornar um token', async ({ assert, client }) => {
  const sessionPayload = {
    password: '123456',
    is_active: true
  }

  const user = await Factory.model('App/Models/User').create(sessionPayload)

  const response = await client
    .post('/sessions')
    .send({
      credential: user.cpf,
      password: sessionPayload.password
    })
    .end()

  const u = await User.findByOrFail('cpf', user.cpf)

  assert.isNull(u.last_sign_in_at)
  assert.isNull(u.last_sign_in_ip_address)
  assert.isNotNull(u.sign_in_count)
  assert.isNotNull(u.current_sign_in_at)
  assert.isNotNull(u.current_sign_in_ip_address)
  assert.isNotNull(response.body.token)
  response.assertStatus(200)
})

test('deve logar o email e retornar um token', async ({ assert, client }) => {
  const sessionPayload = {
    password: '123456',
    is_active: true
  }

  const user = await Factory.model('App/Models/User').create(sessionPayload)

  const response = await client
    .post('/sessions')
    .send({
      credential: user.email,
      password: sessionPayload.password
    })
    .end()

  assert.isNotNull(response.body.token)
  response.assertStatus(200)
})

test('deve retornar o usuário e a organização', async ({ assert, client }) => {
  const sessionPayload = {
    password: '123456',
    is_active: true
  }

  const { id } = await Factory.model('App/Models/Organization').create()

  const user = await Factory
    .model('App/Models/User')
    .create({
      ...sessionPayload,
      organization_id: id
    })

  const response = await client
    .post('/sessions')
    .send({
      credential: user.email,
      password: sessionPayload.password
    })
    .end()

  assert.isNotNull(response.body.user)
  assert.isNotNull(response.body.user.uuid)
  assert.isNotNull(response.body.user.organization)
  assert.isNotNull(response.body.user.organization.uuid)
  response.assertStatus(200)
})

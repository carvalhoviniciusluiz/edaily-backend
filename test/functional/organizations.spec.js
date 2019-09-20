const { test, trait, before } = use('Test/Suite')('Organizations')

trait('Test/ApiClient')
trait('Auth/Client')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

before(async () => {
  await Organization.truncate()
})

test('deve retornar uma lista vazia', async ({ client, assert }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  const response = await client
    .get('organizations')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.total, '0')
})

test('deve retornar uma lista não vazia', async ({ client, assert }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  await Factory.model('App/Models/Organization').create()

  const response = await client
    .get('organizations')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.total, '1')
})

test('deve retornar uma lista paginada', async ({ client, assert }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  await Factory.model('App/Models/Organization').create()
  await Factory.model('App/Models/Organization').create()
  await Factory.model('App/Models/Organization').create()

  const response = await client
    .get('organizations?limit=1')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.equal(response.body.data.length, 1)
})

test('(PUBLICA ROUTE) deve cadastrar uma oganização', async ({ client, assert }) => {
  // const user = await Factory
  //   .model('App/Models/User')
  //   .create()

  const {
    firstname,
    lastname,
    email,
    cpf,
    rg,
    phone,
    zipcode: userZipcode,
    street: userStreet,
    street_number: userStreetNumber,
    neighborhood: userNeighborhood,
    city: userCity,
    state: userState
  } = await Factory.model('App/Models/User').make()

  const {
    name,
    initials,
    cnpj,
    billing_email: billingEmail,
    phone1,
    phone2,
    zipcode,
    street,
    street_number: streetNumber,
    neighborhood,
    city,
    state
  } = await Factory.model('App/Models/Organization').make()

  const response = await client
    .post('organizations')
    // .loginVia(user, 'jwt')
    .send({
      definition: 'company',
      name,
      initials,
      cnpj,
      billing_email: billingEmail,
      phone1,
      phone2,
      zipcode,
      street,
      street_number: streetNumber,
      neighborhood,
      city,
      state,
      responsible_firstname: firstname,
      responsible_lastname: lastname,
      responsible_email: email,
      responsible_cpf: cpf,
      responsible_rg: rg,
      responsible_phone: phone,
      responsible_zipcode: userZipcode,
      responsible_street: userStreet,
      responsible_street_number: userStreetNumber,
      responsible_neighborhood: userNeighborhood,
      responsible_city: userCity,
      responsible_state: userState
    })
    .end()

  response.assertStatus(200)
  assert.exists(response.body.uuid)
})

test('deve retornar uma oganização', async ({ client, assert }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  const { uuid } = await Factory
    .model('App/Models/Organization')
    .create()

  const response = await client
    .get(`organizations/${uuid}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  assert.exists(response.body.uuid)
})

test('deve atualizar uma oganização', async ({ client, assert }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  const { uuid } = await Factory
    .model('App/Models/Organization')
    .create()

  const response = await client
    .put(`organizations/${uuid}`)
    .loginVia(user, 'jwt')
    .send({
      name: 'xpto'
    })
    .end()

  response.assertStatus(200)
  assert.equal(response.body.name, 'xpto')
})

test('deve deletar uma oganização', async ({ client }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  const { uuid } = await Factory
    .model('App/Models/Organization')
    .create()

  const response = await client
    .delete(`organizations/${uuid}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(204)
})

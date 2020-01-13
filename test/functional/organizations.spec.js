require('../../start/graphql')
require('../../start/gqlKernel')

const { test, trait, before, after } = use('Test/Suite')('Organizations')

trait('Test/ApiClient')
trait('Auth/Client')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Organization = use('App/Models/Organization')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

before(async () => {
  await Organization.truncate()
})
after(async () => {
  await Organization.truncate()
})

test('deve retornar uma lista vazia', async ({ client, assert }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  const response = await client
    .post('/')
    .loginVia(user, 'jwt')
    .send({
      query: `
        {
          organizations {
            data {
              uuid
              name
              initials
            }
          }
        }
      `
    }).end()

  response.assertStatus(200)
  assert.exists(response.body.data.organizations)
  assert.equal(response.body.data.organizations.data.length, 0)
})

test('deve retornar uma lista não vazia', async ({ client, assert }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  await Factory.model('App/Models/Organization').create()

  const response = await client
    .post('/')
    .loginVia(user, 'jwt')
    .send({
      query: `
        {
          organizations {
            data {
              uuid
              name
              initials
            }
          }
        }
      `
    }).end()

  response.assertStatus(200)
  assert.exists(response.body.data.organizations)
  assert.equal(response.body.data.organizations.data.length, 1)
})

test('deve retornar uma lista paginada', async ({ client, assert }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  await Factory.model('App/Models/Organization').create()
  await Factory.model('App/Models/Organization').create()
  await Factory.model('App/Models/Organization').create()

  const response = await client
    .post('/')
    .loginVia(user, 'jwt')
    .send({
      query: `
        {
          organizations(perPage:1) {
            data {
              uuid
              name
              initials
            }
          }
        }
      `
    }).end()

  response.assertStatus(200)
  assert.exists(response.body.data.organizations)
  assert.equal(response.body.data.organizations.data.length, 1)
})

test('(PUBLICA ROUTE) deve aceitar os termos', async ({ client, assert }) => {
  const organization = await Factory.model('App/Models/Organization').make()
  const responsible = await Factory.model('App/Models/User').make()

  const response = await client
    .post('/')
    .send({
      query: `
        mutation {
          organization:addOrganizationWithResponsibleAndSubstitute(
            organization:{
              definition:"${organization.definition}",
              name:"${organization.name}",
              initials:"${organization.initials}",
              cnpj:"${organization.cnpj}",
              billing_email:"${organization.billing_email}",
              phone1:"${organization.phone1}",
              phone2:"${organization.phone2}",
              zipcode:"${organization.zipcode}",
              street:"${organization.street}",
              street_number:"${organization.street_number}",
              neighborhood:"${organization.neighborhood}",
              city:"${organization.city}",
              state:"${organization.state}",
              terms_accepted:false
            },
            responsible:{
              firstname:"${responsible.firstname}",
              lastname:"${responsible.lastname}",
              email:"${responsible.email}",
              cpf:"${responsible.cpf}",
              rg:"${responsible.rg}",
              phone:"${responsible.phone2}",
              zipcode:"${responsible.zipcode}",
              street:"${responsible.street}",
              street_number:"${responsible.street_number}",
              neighborhood:"${responsible.neighborhood}",
              city:"${responsible.city}",
              state:"${responsible.state}",
              is_responsible:true,
              is_active:true
            }
          ) {
            uuid
            name
            initials
          }
        }
      `
    }).end()

  response.assertStatus(400)
})

test('(PUBLICA ROUTE) deve cadastrar a organização com o representante',
  async ({ client, assert }) => {
    const organization = await Factory.model('App/Models/Organization').make()
    const responsible = await Factory.model('App/Models/User').make()

    const response = await client
      .post('/')
      .send({
        query: `
        mutation {
          organization:addOrganizationWithResponsibleAndSubstitute(
            organization:{
              definition:"${organization.definition}",
              name:"${organization.name}",
              initials:"${organization.initials}",
              cnpj:"${organization.cnpj}",
              billing_email:"${organization.billing_email}",
              phone1:"${organization.phone1}",
              phone2:"${organization.phone2}",
              zipcode:"${organization.zipcode}",
              street:"${organization.street}",
              street_number:"${organization.street_number}",
              neighborhood:"${organization.neighborhood}",
              city:"${organization.city}",
              state:"${organization.state}",
              terms_accepted:true
            },
            responsible:{
              firstname:"${responsible.firstname}",
              lastname:"${responsible.lastname}",
              email:"${responsible.email}",
              cpf:"${responsible.cpf}",
              rg:"${responsible.rg}",
              phone:"${responsible.phone2}",
              zipcode:"${responsible.zipcode}",
              street:"${responsible.street}",
              street_number:"${responsible.street_number}",
              neighborhood:"${responsible.neighborhood}",
              city:"${responsible.city}",
              state:"${responsible.state}",
              is_responsible:true,
              is_active:true
            }
          ) {
            uuid
            name
            initials
          }
        }
      `
      }).end()

    response.assertStatus(200)
    assert.exists(response.body.data.organization)
    assert.equal(response.body.data.organization.name, organization.name)
    assert.equal(response.body.data.organization.initials, organization.initials)
  })

test('(PUBLICA ROUTE) deve cadastrar com suplente',
  async ({ client, assert }) => {
    const organization = await Factory.model('App/Models/Organization').make()
    const responsible = await Factory.model('App/Models/User').make()
    const substitute = await Factory.model('App/Models/User').make()

    const response = await client
      .post('/')
      .send({
        query: `
        mutation {
          organization:addOrganizationWithResponsibleAndSubstitute(
            organization:{
              definition:"${organization.definition}",
              name:"${organization.name}",
              initials:"${organization.initials}",
              cnpj:"${organization.cnpj}",
              billing_email:"${organization.billing_email}",
              phone1:"${organization.phone1}",
              phone2:"${organization.phone2}",
              zipcode:"${organization.zipcode}",
              street:"${organization.street}",
              street_number:"${organization.street_number}",
              neighborhood:"${organization.neighborhood}",
              city:"${organization.city}",
              state:"${organization.state}",
              terms_accepted:true
            },
            responsible:{
              firstname:"${responsible.firstname}",
              lastname:"${responsible.lastname}",
              email:"${responsible.email}",
              cpf:"${responsible.cpf}",
              rg:"${responsible.rg}",
              phone:"${responsible.phone2}",
              zipcode:"${responsible.zipcode}",
              street:"${responsible.street}",
              street_number:"${responsible.street_number}",
              neighborhood:"${responsible.neighborhood}",
              city:"${responsible.city}",
              state:"${responsible.state}",
              is_responsible:true,
              is_active:true
            },
            substitute:{
              firstname:"${substitute.firstname}",
              lastname:"${substitute.lastname}",
              email:"${substitute.email}",
              cpf:"${substitute.cpf}",
              rg:"${substitute.rg}",
              phone:"${substitute.phone2}",
              zipcode:"${substitute.zipcode}",
              street:"${substitute.street}",
              street_number:"${substitute.street_number}",
              neighborhood:"${substitute.neighborhood}",
              city:"${substitute.city}",
              state:"${substitute.state}",
              is_responsible:true,
              is_active:true
            }
          ) {
            uuid
            name
            initials
          }
        }
      `
      }).end()

    response.assertStatus(200)
    assert.exists(response.body.data.organization)
    assert.equal(response.body.data.organization.name, organization.name)
    assert.equal(response.body.data.organization.initials, organization.initials)
  })

test('deve retornar uma oganização', async ({ client, assert }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  const organization = await Factory
    .model('App/Models/Organization')
    .create()

  const response = await client
    .post('/')
    .loginVia(user, 'jwt')
    .send({
      query: `
        {
          organizations(organization:{uuid:"${organization.uuid}"}) {
            data {
              uuid
              name
              initials
            }
          }
        }
      `
    }).end()

  response.assertStatus(200)
  assert.exists(response.body.data.organizations)
  assert.equal(response.body.data.organizations.data[0].uuid, organization.uuid)
})

test('deve atualizar uma oganização', async ({ client, assert }) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  const organization = await Factory
    .model('App/Models/Organization')
    .create()

  const response = await client
    .post('/')
    .loginVia(user, 'jwt')
    .send({
      query: `
        mutation {
          organization:updateOrganization(
            organization:{
              uuid:"${organization.uuid}"
            },
            data:{
              name:"Inex Ltda.",
              initials:"Inex"
            }) {
            uuid
            name
            initials
          }
        }
      `
    }).end()

  response.assertStatus(200)
  assert.exists(response.body.data.organization)
  assert.equal(response.body.data.organization.uuid, organization.uuid)
  assert.equal(response.body.data.organization.name, 'Inex Ltda.')
  assert.equal(response.body.data.organization.initials, 'Inex')
})

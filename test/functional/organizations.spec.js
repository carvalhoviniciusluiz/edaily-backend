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
  const organization = await Factory.model('App/Models/Organization').make({
    author_id: undefined,
    revisor_id: undefined
  })
  const responsible = await Factory.model('App/Models/User').make({
    password: undefined
  })

  const response = await client
    .post('/')
    .send({
      query: `
      mutation (
        $organization: OrganizationInput!,
        $responsible: UserInput!,
        $substitute: UserInput
      ) {
        hasOrganization: addOrganizationWithResponsibleAndSubstitute (
          organization: $organization,
          responsible: $responsible,
          substitute: $substitute
        )
      }
      `,
      variables: {
        organization: {
          ...{
            ...organization.toJSON()
          },
          terms_accepted: false
        },
        responsible: { ...responsible.toJSON() }
      }
    }).end()

  response.assertStatus(400)
  assert.equal(response.body.data.hasOrganization, null)
})

test('(PUBLICA ROUTE) deve cadastrar a organização com o representante',
  async ({ client, assert }) => {
    const organization = await Factory.model('App/Models/Organization').make({
      author_id: undefined,
      revisor_id: undefined
    })
    const responsible = await Factory.model('App/Models/User').make({
      password: undefined
    })

    const response = await client
      .post('/')
      .send({
        query: `
        mutation (
          $organization: OrganizationInput!,
          $responsible: UserInput!,
          $substitute: UserInput
        ) {
          hasOrganization: addOrganizationWithResponsibleAndSubstitute (
            organization: $organization,
            responsible: $responsible,
            substitute: $substitute
          )
        }
        `,
        variables: {
          organization: {
            ...{
              ...organization.toJSON()
            },
            terms_accepted: true
          },
          responsible: { ...responsible.toJSON() }
        }
      }).end()

    response.assertStatus(200)
    assert.equal(response.body.data.hasOrganization, true)
  })

test('(PUBLICA ROUTE) deve cadastrar com suplente',
  async ({ client, assert }) => {
    const organization = await Factory.model('App/Models/Organization').make({
      author_id: undefined,
      revisor_id: undefined
    })
    const responsible = await Factory.model('App/Models/User').make({
      password: undefined
    })
    const substitute = await Factory.model('App/Models/User').make({
      password: undefined
    })

    const response = await client
      .post('/')
      .send({
        query: `
        mutation (
          $organization: OrganizationInput!,
          $responsible: UserInput!,
          $substitute: UserInput
        ) {
          hasOrganization: addOrganizationWithResponsibleAndSubstitute (
            organization: $organization,
            responsible: $responsible,
            substitute: $substitute
          )
        }
        `,
        variables: {
          organization: {
            ...{
              ...organization.toJSON()
            },
            terms_accepted: true
          },
          responsible: { ...responsible.toJSON() },
          substitute: { ...substitute.toJSON() }
        }
      }).end()

    response.assertStatus(200)
    assert.equal(response.body.data.hasOrganization, true)
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

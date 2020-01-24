require('../../start/graphql')
require('../../start/gqlKernel')

const { test, trait, before, after } = use('Test/Suite')('Document')

trait('Test/ApiClient')
trait('Auth/Client')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Document = use('App/Models/Schemas/Document')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const Helpers = use('Helpers')

before(async () => {
  await User.truncate()
  await Document.deleteMany()
})
after(async () => {
  await User.truncate()
  await Document.deleteMany()
})

test('deve retornar uma lista vazia', async ({ client, assert }) => {
  const organization = await Factory.model('App/Models/Organization').create()

  const user = await Factory.model('App/Models/User').create({
    organization_id: organization.id
  })

  const response = await client
    .post('/')
    .loginVia(user, 'jwt')
    .send({
      query: `
      {
        documents:getAllDocuments(
          organization:{
            uuid:"${organization.uuid}",
          },
          user:{
            uuid:"${user.uuid}",
          }
        ) {
          data { uuid }
        }
      }
      `
    }).end()

  response.assertStatus(200)
  assert.exists(response.body.data.documents)
  assert.equal(response.body.data.documents.data.length, 0)
})

test('deve retornar uma lista não vazia', async ({ client, assert }) => {
  const organization = await Factory.model('App/Models/Organization').create()

  const user = await Factory.model('App/Models/User').create({
    organization_id: organization.id
  })

  await client
    .post('files')
    .loginVia(user, 'jwt')
    .attach('file', Helpers.tmpPath('helloworld.pdf'))
    .end()

  const response = await client
    .post('/')
    .loginVia(user, 'jwt')
    .send({
      query: `
      {
        documents:getAllDocuments(
          organization:{
            uuid:"${organization.uuid}",
          },
          user:{
            uuid:"${user.uuid}",
          }
        ) {
          data { uuid }
        }
      }
      `
    }).end()

  response.assertStatus(200)
  assert.exists(response.body.data.documents)
  assert.equal(response.body.data.documents.data.length, 1)
})

test('deve retornar um único documento', async ({ client, assert }) => {
  const organization = await Factory.model('App/Models/Organization').create()

  const user = await Factory.model('App/Models/User').create({
    organization_id: organization.id
  })

  const res = await client
    .post('files')
    .loginVia(user, 'jwt')
    .attach('file', Helpers.tmpPath('helloworld.pdf'))
    .end()

  const response = await client
    .post('/')
    .loginVia(user, 'jwt')
    .send({
      query: `
      {
        document:getDocument(
          organization:{
            uuid: "${organization.uuid}",
          },
          document:{
            uuid: "${res.body.document_uuid}",
          }
        ) {
          uuid
        }
      }
      `
    }).end()

  response.assertStatus(200)
  assert.exists(response.body.data.document)
  assert.equal(response.body.data.document.uuid, res.body.document_uuid)
})

test('deve retornar os documentos da análise', async ({ client, assert }) => {
  const organization = await Factory.model('App/Models/Organization').create()

  const user = await Factory.model('App/Models/User').create({
    organization_id: organization.id
  })

  const res = await client
    .post('files')
    .loginVia(user, 'jwt')
    .attach('file', Helpers.tmpPath('helloworld.pdf'))
    .end()

  const response = await client
    .post('/')
    .loginVia(user, 'jwt')
    .send({
      query: `
      {
        documents:documentsForAnalysis {
          data {
            uuid
            protocol
          }
        }
      }
      `
    }).end()

  response.assertStatus(200)
  assert.exists(response.body.data.documents)
  assert.equal(response.body.data.documents.data[0].protocol, null)
  assert.equal(response.body.data.documents.data[0].uuid, res.body.document_uuid)
})

test('deve encaminhar matéria', async ({ client, assert }) => {
  const organization = await Factory.model('App/Models/Organization').create()

  const user = await Factory.model('App/Models/User').create({
    organization_id: organization.id
  })

  const res = await client
    .post('files')
    .loginVia(user, 'jwt')
    .attach('file', Helpers.tmpPath('helloworld.pdf'))
    .end()

  const response = await client
    .post('/')
    .loginVia(user, 'jwt')
    .send({
      query: `
      mutation {
        sendDocument(
          organization:{
            uuid:"${organization.uuid}"
          },
          document:{
            uuid:"${res.body.document_uuid}"
          }
        )
      }
      `
    }).end()

  response.assertStatus(200)
  assert.exists(response.body.data)
  assert.equal(response.body.data.sendDocument, res.body.document_uuid)
})

test('deve retornar as matérias enviadas', async ({ client, assert }) => {
  const organization = await Factory.model('App/Models/Organization').create()

  const user = await Factory.model('App/Models/User').create({
    organization_id: organization.id
  })

  const resp = await client
    .post('files')
    .loginVia(user, 'jwt')
    .attach('file', Helpers.tmpPath('helloworld.pdf'))
    .end()

  await client
    .post('/')
    .loginVia(user, 'jwt')
    .send({
      query: `
      mutation {
        sendDocument(
          organization:{
            uuid:"${organization.uuid}"
          },
          document:{
            uuid:"${resp.body.document_uuid}"
          }
        )
      }
      `
    }).end()

  const response = await client
    .post('/')
    .loginVia(user, 'jwt')
    .send({
      query: `
      {
        documents:sentDocuments {
          data {
            uuid
            protocol
          }
        }
      }
      `
    }).end()

  response.assertStatus(200)
  assert.exists(response.body.data.documents)
  assert.equal(response.body.data.documents.data.length, 1)
})

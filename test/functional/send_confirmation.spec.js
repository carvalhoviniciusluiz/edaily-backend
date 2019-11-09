const { test, trait } = use('Test/Suite')('Send Confirmation')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

trait('DatabaseTransactions')
trait('Test/ApiClient')

test('deve informar quando o email não existir', async ({ assert, client }) => {
  const response = await client
    .post('/send_confirmation')
    .send({
      email: 'carvalho.viniciusluiz@gmail.com'
    })
    .end()

  response.assertStatus(400)
  assert.include(response.body[0], {
    message: 'O email não existe.',
    field: 'email',
    validation: 'exists'
  })
})

test('deve retornar 204 para email enviado', async ({ client }) => {
  const sendConfirmationPayload = {
    email: 'carvalho.viniciusluiz@gmail.com'
  }

  await Factory
    .model('App/Models/User')
    .create(sendConfirmationPayload)

  const response = await client
    .post('/send_confirmation')
    .send(sendConfirmationPayload)
    .end()

  response.assertStatus(204)
})

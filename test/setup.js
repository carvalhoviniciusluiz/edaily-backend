const Factory = use('Factory')

module.exports = async (suite) => {
  const user = await Factory
    .model('App/Models/User')
    .create({ password: '123456' })

  suite.Context.getter('user', () => user)
}

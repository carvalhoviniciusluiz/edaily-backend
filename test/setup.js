const Factory = use('Factory')

module.exports = async (suite) => {
  const user = await Factory
    .model('App/Models/User')
    .create()

  suite.Context.getter('user', () => {
    return user
  })
}

'use strict'

const Antl = use('Antl')

class User {
  get validateAll () {
    return true
  }

  get rules () {
    const userId = this.ctx.auth.user.id

    return {
      name: 'string',
      email: `unique:users,email,id,${userId}`,
      cpf: 'cpf',
      phone: 'string'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = User

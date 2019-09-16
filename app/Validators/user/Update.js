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
      phone: 'string',
      old_password: 'string|min:6',
      password: 'required_if:old_password|min:6|confirmed'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = User

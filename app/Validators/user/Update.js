'use strict'

const Antl = use('Antl')

class User {
  get validateAll () {
    return true
  }

  get rules () {
    const userId = this.ctx.auth.user.id

    return {
      email: `email|unique:users,email,id,${userId}`,
      cpf: `cpf|unique:users,cpf,id,${userId}`,
      old_password: 'min:6',
      password: 'required_if:old_password|min:6|confirmed'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = User

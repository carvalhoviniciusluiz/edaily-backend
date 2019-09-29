'use strict'

const ValidatorBase = use('App/Validators/ValidatorBase')

class User extends ValidatorBase {
  get rules () {
    const userId = this.ctx.auth.user.id

    return {
      email: `email|unique:users,email,id,${userId}`,
      cpf: `cpf|unique:users,cpf,id,${userId}`,
      old_password: 'min:6',
      password: 'required_if:old_password|min:6|confirmed'
    }
  }
}

module.exports = User

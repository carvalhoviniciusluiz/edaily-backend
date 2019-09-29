'use strict'

const Antl = use('Antl')

class ResetPassword {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      recovery_token: 'required|exists:users,recovery_token',
      password: 'required|confirmed'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = ResetPassword

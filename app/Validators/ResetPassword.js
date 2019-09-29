'use strict'

const ValidatorBase = use('App/Validators/ValidatorBase')

class ResetPassword extends ValidatorBase {
  get rules () {
    return {
      recovery_token: 'required|exists:users,recovery_token',
      password: 'required|confirmed'
    }
  }
}

module.exports = ResetPassword

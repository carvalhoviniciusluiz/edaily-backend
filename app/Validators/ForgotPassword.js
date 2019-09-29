'use strict'

const ValidatorBase = use('App/Validators/ValidatorBase')

class ForgotPassword extends ValidatorBase {
  get rules () {
    return {
      email: 'required|email|exists:users,email',
      redirect_url: 'required|url'
    }
  }
}

module.exports = ForgotPassword

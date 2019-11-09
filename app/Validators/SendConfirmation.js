'use strict'

const ValidatorBase = use('App/Validators/ValidatorBase')

class SendConfirmation extends ValidatorBase {
  get rules () {
    return {
      email: 'required|email|exists:users,email'
    }
  }
}

module.exports = SendConfirmation

'use strict'

const ValidatorBase = use('App/Validators/ValidatorBase')

class Confirmation extends ValidatorBase {
  get rules () {
    return {
      token: 'required|exists:users,confirmation_token'
    }
  }
}

module.exports = Confirmation

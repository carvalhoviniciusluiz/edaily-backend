'use strict'

const ValidatorBase = use('App/Validators/ValidatorBase')

class Session extends ValidatorBase {
  get rules () {
    return {
      credential: 'required',
      password: 'required'
    }
  }
}

module.exports = Session

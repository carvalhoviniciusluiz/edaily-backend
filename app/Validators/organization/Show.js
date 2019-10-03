'use strict'

const ValidatorBase = use('App/Validators/ValidatorBase')

class Show extends ValidatorBase {
  get rules () {
    return {
      id: 'exists:organizations,uuid'
    }
  }
}

module.exports = Show

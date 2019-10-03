'use strict'

const ValidatorBase = use('App/Validators/ValidatorBase')

class Show extends ValidatorBase {
  get rules () {
    return {
      id: 'required|exists:files,uuid'
    }
  }
}

module.exports = Show

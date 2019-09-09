'use strict'

class Session {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      cpf: 'required',
      password: 'required'
    }
  }
}

module.exports = Session

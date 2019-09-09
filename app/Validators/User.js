'use strict'

class User {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      name: 'required',
      email: 'required|email|unique:users',
      cpf: 'required',
      phone: 'required'
    }
  }
}

module.exports = User

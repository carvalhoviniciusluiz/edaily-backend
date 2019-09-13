'use strict'

const Antl = use('Antl')

class Store {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      name: 'required',
      email: 'required|email',
      cpf: 'required|cpf',
      phone: 'required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Store

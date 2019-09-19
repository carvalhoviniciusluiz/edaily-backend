'use strict'

const Antl = use('Antl')

class Store {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      firstname: 'required',
      lastname: 'required',
      email: 'required|email|unique:users',
      cpf: 'required|cpf|unique:users',
      phone: 'required',
      zipcode: 'required',
      street: 'required',
      street_number: 'required',
      neighborhood: 'required',
      city: 'required',
      state: 'required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Store

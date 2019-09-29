'use strict'

const ValidatorBase = use('App/Validators/ValidatorBase')

class Store extends ValidatorBase {
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
}

module.exports = Store

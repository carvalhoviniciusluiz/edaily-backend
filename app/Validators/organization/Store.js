'use strict'

const Antl = use('Antl')

class Store {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      'company.definition': 'required',
      'company.name': 'required',
      'company.initials': 'required',
      'company.cnpj': 'required|cnpj',
      'company.billing_email': 'required|email',
      'company.phone1': 'required',
      'company.zipcode': 'required',
      'company.street': 'required',
      'company.street_number': 'required',
      'company.neighborhood': 'required',
      'company.city': 'required',
      'company.state': 'required',

      // responsible data
      'responsible.firstname': 'required',
      'responsible.lastname': 'required',
      'responsible.email': 'required|email',
      'responsible.cpf': 'required|cpf',
      'responsible.rg': 'required',
      'responsible.phone': 'required',
      'responsible.zipcode': 'required',
      'responsible.street': 'required',
      'responsible.street_number': 'required',
      'responsible.neighborhood': 'required',
      'responsible.city': 'required',
      'responsible.state': 'required',

      // substitute data
      'substitute.email': 'email',
      'substitute.cpf': 'cpf'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Store

'use strict'

const Antl = use('Antl')

class Store {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      sending_authorized_email: 'required',
      billing_authorized_email: 'required',
      authorized_and_accepted_policy_terms: 'required',

      company: 'required|object',
      'company.definition': 'required',
      'company.name': 'required',
      'company.initials': 'required',
      'company.cnpj': 'required|cnpj|unique:organizations,cnpj',
      'company.billing_email': 'required|email|unique:organizations,billing_email',
      'company.phone1': 'required',
      'company.zipcode': 'required',
      'company.street': 'required',
      'company.street_number': 'required',
      'company.neighborhood': 'required',
      'company.city': 'required',
      'company.state': 'required',

      // responsible data
      responsible: 'required|object',
      'responsible.firstname': 'required',
      'responsible.lastname': 'required',
      'responsible.email': 'required|email|unique:users,email',
      'responsible.cpf': 'required|cpf|unique:users,cpf',
      'responsible.rg': 'required',
      'responsible.phone': 'required',
      'responsible.zipcode': 'required',
      'responsible.street': 'required',
      'responsible.street_number': 'required',
      'responsible.neighborhood': 'required',
      'responsible.city': 'required',
      'responsible.state': 'required',

      // substitute data
      'substitute.email': 'email|unique:users,email',
      'substitute.cpf': 'cpf|unique:users,cpf'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Store

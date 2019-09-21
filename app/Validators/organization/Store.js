'use strict'

const Antl = use('Antl')

class Store {
  get validateAll () {
    return true
  }

  get rules () {
    const rules = {
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

      // terms data
      sending_authorized_email: 'required',
      billing_authorized_email: 'required',
      authorized_and_accepted_policy_terms: 'required'
    }

    const { substitute } = this.ctx.request.all()

    const complementaryRules = substitute ? {
      substitute: 'required|object',
      'substitute.firstname': 'required',
      'substitute.lastname': 'required',
      'substitute.email': 'required|email|unique:users,email',
      'substitute.cpf': 'required|cpf|unique:users,cpf',
      'substitute.rg': 'required',
      'substitute.phone': 'required',
      'substitute.zipcode': 'required',
      'substitute.street': 'required',
      'substitute.street_number': 'required',
      'substitute.neighborhood': 'required',
      'substitute.city': 'required',
      'substitute.state': 'required'
    } : {}

    return { ...rules, ...complementaryRules }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Store

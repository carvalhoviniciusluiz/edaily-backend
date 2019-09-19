'use strict'

const Antl = use('Antl')

class Store {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      definition: 'required',
      name: 'required',
      initials: 'required',
      cnpj: 'required|cnpj',
      billing_email: 'required|email',
      phone1: 'required',
      zipcode: 'required',
      street: 'required',
      street_number: 'required',
      neighborhood: 'required',
      city: 'required',
      state: 'required',

      // responsible data
      responsible_firstname: 'required',
      responsible_lastname: 'required',
      responsible_email: 'required|email',
      responsible_cpf: 'required|cpf',
      responsible_rg: 'required',
      responsible_phone: 'required',
      responsible_zipcode: 'required',
      responsible_street: 'required',
      responsible_street_number: 'required',
      responsible_neighborhood: 'required',
      responsible_city: 'required',
      responsible_state: 'required',

      // substitute data
      substitute_email: 'email',
      substitute_cpf: 'cpf'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Store

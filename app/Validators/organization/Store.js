'use strict'

const Antl = use('Antl')

class Store {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      name: 'required',
      initials: 'required',
      cnpj: 'required|cnpj',
      billing_email: 'required|email',
      phone1: 'required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Store

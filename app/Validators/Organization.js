'use strict'

const Antl = use('Antl')

class Organization {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      name: 'required',
      initials: 'required',
      cnpj: 'required',
      billing_email: 'required|email',
      phone1: 'required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Organization

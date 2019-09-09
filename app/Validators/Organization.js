'use strict'

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
}

module.exports = Organization

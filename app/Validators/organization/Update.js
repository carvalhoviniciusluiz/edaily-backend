'use strict'

const ValidatorBase = use('App/Validators/ValidatorBase')

class Update extends ValidatorBase {
  get rules () {
    return {
      name: 'string',
      initials: 'string',
      cnpj: 'cnpj',
      billing_email: 'email',
      phone1: 'string'
    }
  }
}

module.exports = Update

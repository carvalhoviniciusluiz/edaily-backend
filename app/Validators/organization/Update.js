'use strict'

const Antl = use('Antl')

class Update {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      name: 'string',
      initials: 'string',
      cnpj: 'cnpj',
      billing_email: 'email',
      phone1: 'string'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Update

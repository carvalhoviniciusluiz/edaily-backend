'use strict'

const Antl = use('Antl')

class UserUpdate {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      name: 'string',
      email: 'email',
      cpf: 'cpf',
      phone: 'string'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = UserUpdate

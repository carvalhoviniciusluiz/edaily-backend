'use strict'

const Antl = use('Antl')

class OrganizationUser {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      name: 'required',
      email: 'required|email',
      cpf: 'required',
      phone: 'required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = OrganizationUser

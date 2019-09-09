'use strict'

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
}

module.exports = OrganizationUser

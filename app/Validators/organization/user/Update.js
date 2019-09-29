'use strict'

const ValidatorBase = use('App/Validators/ValidatorBase')

class Update extends ValidatorBase {
  get rules () {
    return {
      organizations_id: 'exists:organizations,uuid',
      id: 'exists:users,uuid',
      email: 'email',
      cpf: 'cpf'
    }
  }
}

module.exports = Update

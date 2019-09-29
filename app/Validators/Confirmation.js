'use strict'

const Antl = use('Antl')

class Confirmation {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      token: 'required|exists:users,confirmation_token'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Confirmation

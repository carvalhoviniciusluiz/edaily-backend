'use strict'

const Antl = use('Antl')

class Update {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      organizations_id: 'exists:organizations,uuid',
      id: 'exists:users,uuid',
      email: 'email',
      cpf: 'cpf'
    }
  }

  get data () {
    const rawBody = this.ctx.request.all()
    const params = this.ctx.params

    return { ...rawBody, ...params }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Update

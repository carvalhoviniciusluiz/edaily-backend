'use strict'

const Antl = use('Antl')

class ValidatorBase {
  get validateAll () {
    return true
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

module.exports = ValidatorBase

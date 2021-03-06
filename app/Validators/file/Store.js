'use strict'

const ValidatorBase = use('App/Validators/ValidatorBase')

const Env = use('Env')

class Store extends ValidatorBase {
  get rules () {
    return {
      file: `required|file|file_ext:pdf|file_size:${Env.get('FILE_SIZE', '10mb')}|file_types:application`
    }
  }

  get data () {
    const file = this.ctx.request.file('file')

    return { file }
  }
}

module.exports = Store

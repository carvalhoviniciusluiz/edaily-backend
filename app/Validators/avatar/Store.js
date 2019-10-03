'use strict'

const ValidatorBase = use('App/Validators/ValidatorBase')

const Env = use('Env')

class Store extends ValidatorBase {
  get rules () {
    return {
      file: `required|file|file_ext:png,jpg,jpeg|file_size:${Env.get('FILE_SIZE', '3mb')}|file_types:image`
    }
  }

  get data () {
    const file = this.ctx.request.file('file')

    return { file }
  }
}

module.exports = Store

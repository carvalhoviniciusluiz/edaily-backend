'use strict'

const mongoose = require('mongoose')

const { ServiceProvider } = require('@adonisjs/fold')

class ValidationProvider extends ServiceProvider {
  async existsFn (data, field, message, args, get) {
    const Database = use('Database')

    const value = get(data, field)
    if (!value) {
      return
    }

    const [table, column] = args

    const row = await Database.table(table).where(column, value).first()
    if (!row) {
      throw message
    }
  }

  async existsInMongoFn (data, field, message, args, get) {
    const value = get(data, field)
    if (!value) {
      return
    }

    const [modelName, column] = args

    const Model = mongoose.model(modelName)
    const row = await Model.countDocuments({
      [column]: value
    })

    if (!row) {
      throw message
    }
  }

  boot () {
    const Validator = use('Validator')

    Validator.extend('exists', this.existsFn.bind(this))
    Validator.extend('existsInMongo', this.existsInMongoFn.bind(this))
  }
}

module.exports = ValidationProvider

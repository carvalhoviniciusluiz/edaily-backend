'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

const mongoose = require('mongoose')

/*
  |--------------------------------------------------------------------------
  | connection
  |--------------------------------------------------------------------------
  |
  | Mongo connection to be used by default.
  |
  */

const mongodbUri = Env.get('MONGODB_URI') + (
  Env.get('NODE_ENV') === 'testing' ? '-test' : ''
)

mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true
})

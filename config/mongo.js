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

mongoose.connect(Env.get('MONGODB_URI'), {
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true
})

'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

const SQLGrid = require('@internalfx/sqlgrid')

/*
  |--------------------------------------------------------------------------
  | connection
  |--------------------------------------------------------------------------
  |
  | Database connection to be used by default.
  |
  */

const sequelizeConf = {
  database: Env.get('DB_DATABASE'),
  username: Env.get('DB_USER'),
  password: Env.get('DB_PASSWORD'),
  dialect: 'postgres',
  logging: null
}

/*
  |--------------------------------------------------------------------------
  | SQLGrid instance
  |--------------------------------------------------------------------------
  |
  | Verifies required tables and indexes exist and will create them if missing.
  |
  */

const bucket = SQLGrid(sequelizeConf, { bucketName: 'bucket' })

bucket.initBucket()

module.exports = {
  bucket
}

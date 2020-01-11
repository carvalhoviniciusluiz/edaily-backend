'use strict'

const Gql = use('Gql')

/*
|--------------------------------------------------------------------------
| Global middleware
|--------------------------------------------------------------------------
|
| Global middleware are executed on each Resolver.
|
*/
const globalMiddleware = []

/*
|--------------------------------------------------------------------------
| Named middleware
|--------------------------------------------------------------------------
|
| Named middleware are defined as key/value pairs. Later you can use the
| keys to run selected middleware on a given resolver.
|
| // define
| {
|   auth: 'Adonis/Middleware/Auth'
| }
*/
const namedMiddleware = {
  auth: 'App/Middleware/Auth',
  userCreateValidator: 'App/Middleware/Validators/User/Create',
  userUpdateValidator: 'App/Middleware/Validators/User/Update',
  organizationCreateValidator: 'App/Middleware/Validators/Organization/Create',
  organizationUpdateValidator: 'App/Middleware/Validators/Organization/Update',
  responsibleValidator: 'App/Middleware/Validators/Responsible',
  substituteValidator: 'App/Middleware/Validators/Substitute'
}

Gql.registerGlobal(globalMiddleware)
  .registerNamed(namedMiddleware)
  .register()

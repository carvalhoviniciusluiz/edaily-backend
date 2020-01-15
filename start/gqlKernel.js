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
  avatarValidator: 'App/Middleware/Validators/Avatar',
  authValidator: 'App/Middleware/Auth',
  documentValidator: 'App/Middleware/Validators/Document',
  organizationCreateValidator: 'App/Middleware/Validators/Organization/Create',
  organizationUpdateValidator: 'App/Middleware/Validators/Organization/Update',
  passwordValidator: 'App/Middleware/Validators/Password',
  profileValidator: 'App/Middleware/Validators/Profile',
  substituteValidator: 'App/Middleware/Validators/Substitute',
  responsibleValidator: 'App/Middleware/Validators/Responsible',
  userCreateValidator: 'App/Middleware/Validators/User/Create',
  userUpdateValidator: 'App/Middleware/Validators/User/Update'
}

Gql.registerGlobal(globalMiddleware)
  .registerNamed(namedMiddleware)
  .register()

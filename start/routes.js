'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('sessions', 'SessionController.store')

Route.post('users', 'UserController.store')

Route.post('forgot_password', 'ForgotPasswordController.store')
Route.put('forgot_password', 'ForgotPasswordController.update')

Route.group(() => {
  Route.post('files', 'FileController.store')
  Route.get('files/:id', 'FileController.show')

  Route
    .resource('organizations', 'OrganizationController')
    .apiOnly()

  Route
    .resource('organizations.users', 'organization/UserController')
    .apiOnly()
}).middleware(['auth'])

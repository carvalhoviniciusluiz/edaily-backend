'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

/*
  |--------------------------------------------------------------------------
  | public routes config
  |--------------------------------------------------------------------------
  |
  | Routes with authentication not required.
  |
  */
Route.post('organizations', 'OrganizationController.store')
  .validator('organization/Store')

Route.get('files/:id', 'FileController.show')

Route.post('users', 'UserController.store').validator('user/Store')

Route.post('sessions', 'SessionController.store').validator('Session')

Route.get('confirm', 'ConfirmationController.store').validator('Confirmation')

Route
  .post('forgot_password', 'ForgotPasswordController.store')
  .validator('ForgotPassword')

Route
  .post('reset_password', 'ResetPasswordController.store')
  .validator('ResetPassword')

/*
  |--------------------------------------------------------------------------
  | authenticated route configuration
  |--------------------------------------------------------------------------
  |
  | Routes requiring token validation.
  |
  */

Route.group(() => {
  Route.post('files', 'FileController.store')

  Route.put('users', 'UserController.update').validator('user/Update')

  Route
    .resource('organizations', 'OrganizationController')
    .apiOnly()
    .except(['store'])
    .validator(new Map(
      [
        [['organizations.update'], ['organization/Update']]
      ]
    ))

  Route
    .resource('organizations.users', 'organization/UserController')
    .apiOnly()
    .validator(new Map(
      [
        [['organizations.users.store'], ['organization/user/Store']],
        [['organizations.users.update'], ['organization/user/Update']]
      ]
    ))
}).middleware(['auth'])

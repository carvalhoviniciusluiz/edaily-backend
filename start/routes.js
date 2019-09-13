'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('sessions', 'SessionController.store').validator('Session')

Route.get('confirm', 'ConfirmationController.store').validator('Confirmation')

Route.post('users', 'UserController.store').validator('User')

Route
  .post('forgot_password', 'ForgotPasswordController.store')
  .validator('ForgotPassword')

Route
  .post('reset_password', 'ResetPasswordController.store')
  .validator('ResetPassword')

Route.group(() => {
  Route.post('files', 'FileController.store')
  Route.get('files/:id', 'FileController.show')

  Route
    .resource('organizations', 'OrganizationController')
    .apiOnly()
    .validator(new Map(
      [
        [['organizations.store'], ['organization/Store']],
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

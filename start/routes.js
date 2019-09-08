'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('sessions', 'SessionController.store')

Route.post('users', 'UserController.store')

Route.post('forgot_password', 'ForgotPasswordController.store')
Route.put('forgot_password', 'ForgotPasswordController.update')

Route.post('files', 'FileController.store')

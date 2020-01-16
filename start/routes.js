'use strict'

const Env = use('Env')

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

const Gql = use('Gql')

/*
  |--------------------------------------------------------------------------
  | graphql routes config
  |--------------------------------------------------------------------------
  |
  | Route /graphiql only released in development mode.
  |
  */
Route.post('/', ctx => Gql.handle(ctx))

if (Env.get('NODE_ENV') === 'development') {
  Route.get('/graphiql', ctx => Gql.handleUi(ctx))
}

/*
  |--------------------------------------------------------------------------
  | public routes config
  |--------------------------------------------------------------------------
  |
  | Routes with authentication not required.
  |
  */
Route.get('avatars/:id', 'AvatarController.show').validator('file/Show')
Route.get('files/:id', 'FileController.show').validator('file/Show')

Route.post('sessions', 'SessionController.store').validator('Session')

Route.get('confirm', 'ConfirmationController.store').validator('Confirmation')

Route
  .post('forgot_password', 'ForgotPasswordController.store')
  .validator('ForgotPassword')

Route
  .post('reset_password', 'ResetPasswordController.store')
  .validator('ResetPassword')

Route
  .post('send_confirmation', 'SendConfirmationController.store')
  .validator('SendConfirmation')

/*
  |--------------------------------------------------------------------------
  | authenticated route configuration
  |--------------------------------------------------------------------------
  |
  | Routes requiring token validation.
  |
  */
Route.group(() => {
  Route.post('avatars', 'AvatarController.store').validator('avatar/Store')
  Route.post('files', 'FileController.store').validator('file/Store')
  Route.delete('files/:id', 'FileController.destroy').validator('file/Show')
}).middleware(['auth'])

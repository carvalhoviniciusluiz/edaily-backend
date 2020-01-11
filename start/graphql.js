'use strict'

const Gql = use('Gql')

Gql.schema('User', () => {
  Gql.query('Queries/UserController')
  Gql.mutation('Mutations/UserController')
}).middleware(['auth'])

Gql.schema('Organization', () => {
  Gql.query('Queries/OrganizationController')
  Gql.mutation('Mutations/OrganizationController')
})

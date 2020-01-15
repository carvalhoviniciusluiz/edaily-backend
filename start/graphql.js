'use strict'

const Gql = use('Gql')

Gql.schema('Document', () => {
  Gql.query('Queries/DocumentController')
  Gql.mutation('Mutations/DocumentController')
}).middleware(['authValidator'])

Gql.schema('User', () => {
  Gql.query('Queries/UserController')
  Gql.mutation('Mutations/UserController')
}).middleware(['authValidator'])

Gql.schema('Organization', () => {
  Gql.query('Queries/OrganizationController')
  Gql.mutation('Mutations/OrganizationController')
})

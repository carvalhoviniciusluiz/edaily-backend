'use strict'

const Gql = use('Gql')

Gql.schema('Organization', () => {
  Gql.query('Queries/OrganizationController')
  Gql.mutation('Mutations/OrganizationController')
})

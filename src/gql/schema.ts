import { gql } from 'graphql-tag'

export const typeDefs = gql`
  scalar DateTime

  type Query {
    _random: Float!
  }
`

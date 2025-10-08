import type { Resolvers } from '@gql/artifacts/resolvers'
import { GraphQLScalarType, Kind } from 'graphql'

const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize: (value) => (value instanceof Date ? value.toISOString() : null),
  parseValue: (value) => (typeof value === 'string' ? new Date(value) : null),
  parseLiteral: (ast) => (ast.kind === Kind.STRING ? new Date(ast.value) : null),
})

export const resolvers: Resolvers = {
  DateTime,

  Query: {
    _random: () => Math.random(),
  },
}

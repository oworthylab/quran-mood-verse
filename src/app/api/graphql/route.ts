import { ApolloServer } from "@apollo/server"
import { startServerAndCreateNextHandler } from "@as-integrations/next"
import { resolvers } from "@gql/resolvers"
import { typeDefs } from "@gql/schema"
import { makeExecutableSchema } from "@graphql-tools/schema"
import depthLimit from "graphql-depth-limit"
import { applyMiddleware } from "graphql-middleware"
import { NextRequest } from "next/server"

const server = new ApolloServer({
  validationRules: [depthLimit(4)],
  schema: applyMiddleware(makeExecutableSchema({ typeDefs, resolvers })),
})

const handler = startServerAndCreateNextHandler<NextRequest>(server)

export { handler as GET, handler as POST }

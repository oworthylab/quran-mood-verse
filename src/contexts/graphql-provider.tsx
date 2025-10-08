'use client'

import { IS_DEV } from '@/env'
import { from, HttpLink } from '@apollo/client'
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from '@apollo/client-integration-nextjs'
import { loadDevMessages } from '@apollo/client/dev'
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename'

if (IS_DEV) loadDevMessages()

const link = from([removeTypenameFromVariables(), new HttpLink({ uri: '/api/graphql' })])

function makeClient() {
  return new ApolloClient({
    link,

    cache: new InMemoryCache({ dataIdFromObject: () => false }),

    defaultOptions: {
      watchQuery: { fetchPolicy: 'cache-first', errorPolicy: 'ignore' },
      query: { fetchPolicy: 'cache-first', errorPolicy: 'ignore' },
    },

    devtools: { enabled: IS_DEV, name: 'Gql' },
  })
}

export function ApolloProvider({ children }: React.PropsWithChildren) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
}

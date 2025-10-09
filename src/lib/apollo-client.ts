import { env, IS_DEV } from "@/env"
import { joinUrl } from "@/lib/url"
import { from, HttpLink } from "@apollo/client"
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from "@apollo/client-integration-nextjs"
import { headers } from "next/headers"

export const { getClient, query, PreloadQuery } = registerApolloClient(async () => {
  return new ApolloClient({
    link: from([
      new HttpLink({
        uri: joinUrl(env.NEXT_PUBLIC_ORIGIN, "/api/graphql"),
        credentials: "include",
        headers: Object.fromEntries(await headers()),
      }),
    ]),
    cache: new InMemoryCache({ dataIdFromObject: () => false, addTypename: false }),

    defaultOptions: {
      watchQuery: { fetchPolicy: "cache-and-network", errorPolicy: "ignore" },
      query: { fetchPolicy: "no-cache", errorPolicy: "ignore" },
      mutate: { fetchPolicy: "no-cache", errorPolicy: "all" },
    },

    devtools: { enabled: IS_DEV, name: "Gql" },
  })
})

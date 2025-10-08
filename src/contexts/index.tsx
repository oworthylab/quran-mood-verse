import { ApolloProvider } from '@/contexts/graphql-provider'
import { ThemeProvider } from '@/contexts/theme-context'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </ApolloProvider>
  )
}

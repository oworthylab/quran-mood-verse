import { Toaster } from '@/components/ui/sonner'
import { ApolloProvider } from '@/contexts/graphql-provider'
import { ThemeProvider } from '@/contexts/theme-context'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider>
      <Toaster richColors className="cursor-grab select-none active:cursor-grabbing" />
      <ThemeProvider>{children}</ThemeProvider>
    </ApolloProvider>
  )
}

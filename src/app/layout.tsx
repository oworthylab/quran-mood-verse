import '@/styles/index.css'

import { ApolloProvider } from '@/contexts/graphql-provider'
import { env } from '@/env'
import { Metadata } from 'next'

import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/contexts/theme-context'
import { Amiri } from 'next/font/google'

const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-amiri',
})

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_ORIGIN),
  title: 'Find your verses',
  description: 'Discover verse based on you mood, situation or topic.',
}

export default async function Root({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`font-sans antialiased ${amiri.variable}`}>
          <Toaster richColors className="cursor-grab select-none active:cursor-grabbing" />
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    </ApolloProvider>
  )
}

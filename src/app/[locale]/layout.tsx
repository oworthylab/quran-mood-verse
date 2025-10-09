import "@/styles/index.css"

import { env } from "@/env"
import { Locale, routing } from "@/i18n/routing"
import { Metadata } from "next"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { setRequestLocale } from "next-intl/server"

import { Provider } from "@/contexts"
import { Amiri } from "next/font/google"
import { notFound } from "next/navigation"

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-amiri",
})

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_ORIGIN),
  title: "Find your verses",
  description: "Discover verse based on you mood, situation or topic.",
}

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function Layout({ children, params }: LayoutProps) {
  const locale = (await params).locale
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`font-sans antialiased ${amiri.variable}`}>
        <NextIntlClientProvider locale={locale}>
          <Provider>{children}</Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

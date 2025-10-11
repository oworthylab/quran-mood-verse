import "@/styles/index.css"

import { env } from "@/env"
import { Locale, routing } from "@/i18n/routing"
import { Metadata } from "next"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { Footer } from "@/components/shared/footer"
import { Provider } from "@/contexts"
import { Inter } from "next/font/google"
import LocaleFont from "next/font/local"
import { notFound } from "next/navigation"

const inter = Inter({ subsets: ["latin"], variable: "--ff-inter" })

const nastaleeq = LocaleFont({
  variable: "--ff-indopak-nastaleeq",
  src: "../../../public/fonts/indopak-nastaleeq.ttf",
})

const kfgqpcNaskh = LocaleFont({
  variable: "--ff-kfgqpc-taha-naskh",
  src: "../../../public/fonts/kfgqpc-taha-naskh.ttf",
})

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const locale = (await params).locale
  const t = await getTranslations({ locale, namespace: "app" })

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_ORIGIN),
    title: t("title"),
    description: t("description"),
  }
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
      <body
        className={[
          "from-background to-muted/20 flex min-h-screen flex-col bg-gradient-to-b font-sans antialiased",
          inter.variable,
          nastaleeq.variable,
          kfgqpcNaskh.variable,
        ].join(" ")}
      >
        <NextIntlClientProvider locale={locale}>
          <Provider>
            <div className="flex-1">{children}</div>
            <Footer />
          </Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

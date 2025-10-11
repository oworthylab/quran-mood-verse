import "@/styles/index.css"

import { env } from "@/env"
import { Locale, routing } from "@/i18n/routing"
import { Metadata } from "next"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { Footer } from "@/components/shared/footer"
import { Provider } from "@/contexts"
import { Hind_Siliguri, Inter } from "next/font/google"
import LocaleFont from "next/font/local"
import { notFound } from "next/navigation"

const inter = Inter({ subsets: ["latin"], variable: "--ff-inter" })
const hindSiliguri = Hind_Siliguri({
  subsets: ["latin"],
  variable: "--ff-hind-siliguri",
  weight: ["300", "400", "500", "600", "700"],
})

const nastaleeq = LocaleFont({
  variable: "--ff-nastaleeq",
  src: "../../../public/fonts/nastaleeq.ttf",
})

const kfgqpcNaskh = LocaleFont({
  variable: "--ff-kfgqpc",
  src: "../../../public/fonts/kfgqpc.otf",
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

const localeFontMap = {
  bn: "font-hind-siliguri",
  en: "font-inter",
}

export default async function Layout({ children, params }: LayoutProps) {
  const locale = (await params).locale
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={[
          "from-background to-muted/20 flex min-h-screen flex-col bg-gradient-to-b antialiased",
          inter.variable,
          nastaleeq.variable,
          kfgqpcNaskh.variable,
          hindSiliguri.variable,
          localeFontMap[locale] ?? "font-sans",
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

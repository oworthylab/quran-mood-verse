import { QuranMoodExplorer } from "@/components/quran-mood-explorer"
import { Locale, routing } from "@/i18n/routing"
import { hasLocale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

export default async function Index({ params }: { params: Promise<{ locale: Locale }> }) {
  const locale = (await params).locale
  if (!hasLocale(routing.locales, locale)) notFound()

  setRequestLocale(locale)

  return (
    <main>
      <QuranMoodExplorer />
    </main>
  )
}

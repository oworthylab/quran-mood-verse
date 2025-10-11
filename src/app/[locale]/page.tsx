"use client"

import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import dynamic from "next/dynamic"

function LoadingComponent() {
  const t = useTranslations()

  return (
    <div className="flex h-[calc(var(--fs)-var(--footer-height))] items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="text-muted-foreground size-8 animate-spin" />
        <span className="text-muted-foreground text-sm">{t("loading")}</span>
      </div>
    </div>
  )
}

const QuranMoodExplorer = dynamic(
  () => import("@/components/quran-mood-explorer").then((mod) => mod.QuranMoodExplorer),
  {
    ssr: false,
    loading: LoadingComponent,
  }
)

export default function Index() {
  return (
    <main className="smart-container">
      <QuranMoodExplorer />
    </main>
  )
}

"use client"

import { Loader2 } from "lucide-react"
import dynamic from "next/dynamic"

const QuranMoodExplorer = dynamic(
  () => import("@/components/quran-mood-explorer").then((mod) => mod.QuranMoodExplorer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(var(--fs)-var(--footer-height))] items-center justify-center">
        <Loader2 className="text-muted-foreground size-8 animate-spin" />
      </div>
    ),
  }
)

export default function Index() {
  return (
    <main className="smart-container">
      <QuranMoodExplorer />
    </main>
  )
}

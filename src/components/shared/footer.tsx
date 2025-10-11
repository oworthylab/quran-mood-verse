"use client"

import { LanguageSwitch } from "@/components/shared/language-switch"
import { ScriptSwitch } from "@/components/shared/script-switch"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { useTranslations } from "next-intl"

export function Footer() {
  const t = useTranslations("footer")

  return (
    <footer className="bg-background/50 mt-auto flex h-[var(--footer-height)] items-center border-t backdrop-blur-sm">
      <div className="smart-container">
        <div className="flex flex-col-reverse items-center justify-center gap-2 sm:flex-row sm:justify-between">
          <div className="text-muted-foreground text-sm">{t("tagline")}</div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitch />
            <ScriptSwitch />
          </div>
        </div>
      </div>
    </footer>
  )
}

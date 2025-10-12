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
          <div className="text-muted-foreground flex flex-col text-sm">
            {t("tagline")}
            <div className="flex gap-2 max-sm:hidden">
              <a
                href="https://github.com/al-imam"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-200"
              >
                GitHub
              </a>
              <a
                href="https://alimam.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-200"
              >
                Portfolio
              </a>
            </div>
          </div>

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

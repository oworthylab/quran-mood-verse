"use client"

import { Link, usePathname } from "@/i18n/navigation"
import { Locale, useLocale } from "next-intl"

const languages = [
  { code: "en" as Locale, name: "English", flag: "🇺🇸" },
  { code: "bn" as Locale, name: "Bengali", flag: "🇧🇩" },
]

export function LanguageSwitch() {
  const pathname = usePathname()
  const currentLocale = useLocale()

  return (
    <div className="bg-background/80 flex max-w-fit items-center gap-1 rounded border p-1">
      {languages.map((language) => {
        const isActive = currentLocale === language.code

        return (
          <Link
            href={pathname}
            key={language.code}
            locale={language.code}
            className={`flex h-6 items-center rounded-sm px-1.5 text-xs font-medium transition-all ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}
          >
            <span className="mr-1">{language.flag}</span>
            {language.code.toUpperCase()}
          </Link>
        )
      })}
    </div>
  )
}

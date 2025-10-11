"use client"

import { cn } from "@/lib/utils"
import { useScriptStore } from "@/stores/script-store"
import { useTranslations } from "next-intl"

export function ScriptSwitch() {
  const { setScript, script } = useScriptStore()
  const t = useTranslations("scripts")

  const scripts = [
    { code: "indopak" as const, name: t("indopak") },
    { code: "uthmani" as const, name: t("uthmani") },
  ]

  return (
    <div className="bg-background/80 flex max-w-fit items-center gap-1 rounded border p-1">
      {scripts.map((option) => {
        const isActive = script === option.code

        return (
          <button
            key={option.code}
            onClick={() => setScript(option.code)}
            className={cn(
              "flex h-6 items-center rounded-sm px-1.5 text-xs font-medium transition-all",
              {
                "bg-primary text-primary-foreground shadow-sm": isActive,
                "hover:bg-muted text-muted-foreground hover:text-foreground": !isActive,
              }
            )}
          >
            {option.name}
          </button>
        )
      })}
    </div>
  )
}

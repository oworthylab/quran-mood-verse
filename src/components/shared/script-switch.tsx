"use client"

import { cn } from "@/lib/utils"
import { useScriptStore } from "@/stores/script-store"

const scripts = [
  { code: "indopak" as const, name: "Indopak", flag: "🕌" },
  { code: "uthmani" as const, name: "Uthmani", flag: "📖" },
]

export function ScriptSwitch() {
  const { setScript, script } = useScriptStore()

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-background/80 flex items-center gap-1 rounded border p-1">
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
              <span className="mr-1">{option.flag}</span>
              {option.name.toUpperCase()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

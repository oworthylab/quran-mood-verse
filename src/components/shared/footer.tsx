"use client"

import { LanguageSwitch } from "./language-switch"
import { ScriptSwitch } from "./script-switch"

export function Footer() {
  return (
    <footer className="bg-background/50 mt-auto flex h-[var(--footer-height)] items-center border-t backdrop-blur-sm">
      <div className="smart-container">
        <div className="flex flex-col-reverse items-center justify-center gap-2 sm:flex-row sm:justify-between">
          <div className="text-muted-foreground text-sm">Find verses that speak to your soul</div>

          <div className="flex items-center gap-2">
            <LanguageSwitch />
            <ScriptSwitch />
          </div>
        </div>
      </div>
    </footer>
  )
}

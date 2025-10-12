"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="secondary" size="icon" className="size-[2.125rem]">
        <Sun className="size-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      className="size-[2.125rem]"
      onClick={(evt) => {
        const rect = evt.currentTarget.getBoundingClientRect()

        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const xPercent = (centerX / window.innerWidth) * 100
        const yPercent = (centerY / window.innerHeight) * 100

        document.documentElement.style.setProperty("--x", `${xPercent}%`)
        document.documentElement.style.setProperty("--y", `${yPercent}%`)

        if (document.startViewTransition) {
          document.startViewTransition(() => {
            setTheme(resolvedTheme === "light" ? "dark" : "light")
          })
        } else {
          setTheme(resolvedTheme === "light" ? "dark" : "light")
        }
      }}
    >
      {resolvedTheme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}

      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

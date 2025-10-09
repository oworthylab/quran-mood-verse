"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { PropsWithChildren } from "react"

export function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <NextThemesProvider defaultTheme="system" enableColorScheme attribute="class" enableSystem>
      {children}
    </NextThemesProvider>
  )
}

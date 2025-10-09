import { useSearchParams as useS } from "next/navigation"
import { useMemo } from "react"

export function useSearchParams() {
  const searchParams = useS()!

  const setSearchParam = useMemo(
    () => ({
      set(params: Record<string, string | number | boolean | undefined | null | string[]>) {
        const url = new URL(window.location.href)

        Object.entries(params).forEach(([key, value]) => {
          if (value === undefined || value === null) {
            url.searchParams.delete(key)
          } else if (Array.isArray(value)) {
            url.searchParams.delete(key)
            value.forEach((v) => url.searchParams.append(key, String(v)))
          } else {
            url.searchParams.set(key, String(value))
          }
        })

        window.history.replaceState({}, "", url.toString())
      },
      remove: (keys: string | string[]) => {
        const url = new URL(window.location.href)
        const keysToDelete = Array.isArray(keys) ? keys : [keys]

        keysToDelete.forEach((key) => {
          url.searchParams.delete(key)
        })

        window.history.replaceState({}, "", url.toString())
      },
    }),
    []
  )

  return [searchParams, setSearchParam] as const
}

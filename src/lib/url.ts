import urlJoin from 'proper-url-join'

export const joinUrl = urlJoin

export function decodeUrlParameters(obj: Record<string, string>): Record<string, string> {
  const decoded: Record<string, string> = {}

  for (const [key, value] of Object.entries(obj)) {
    decoded[key] = decodeURIComponent(value)
  }

  return decoded
}

export function searchParamsToObject<T extends URLSearchParams>(
  searchParams: T
): Record<string, string | string[]> {
  const obj: Record<string, string | string[]> = {}

  searchParams.forEach((value, key) => {
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value)
      } else {
        obj[key] = [obj[key], value]
      }
    } else {
      obj[key] = value
    }
  })

  return obj
}

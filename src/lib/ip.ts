import { NextRequest } from "next/server"
import { z } from "zod"

const ipSchema = z
  .string()
  .ip({ version: "v4" })
  .or(z.string().ip({ version: "v6" }))

export function getClientIp(req: NextRequest): string | null {
  const headersToCheck = ["x-real-ip", "cf-connecting-ip", "true-client-ip", "x-client-ip"]

  const value = req.headers.get("x-forwarded-for")
  if (value) {
    const ipList = value.split(",").map((ip) => ip.trim())
    const firstIp = ipList[0]
    const result = ipSchema.safeParse(firstIp)
    if (result.success) return result.data
  }

  for (const header of headersToCheck) {
    const value = req.headers.get(header)
    if (value) {
      const result = ipSchema.safeParse(value)
      if (result.success) return result.data
    }
  }

  const fallbackIp = (req as unknown as { ip: string }).ip
  const result = ipSchema.safeParse(fallbackIp)
  return result.success ? result.data : null
}

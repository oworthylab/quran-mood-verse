import { createHash as nodeCreateHash } from "crypto"

export function createHash(input: string): string {
  return nodeCreateHash("sha256").update(input).digest("hex").slice(0, 16)
}

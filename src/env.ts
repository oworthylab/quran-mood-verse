import { z } from "zod"

const isServer = typeof window === "undefined"

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_ORIGIN: z.string().url().default("http://localhost:3000"),

  GEMINI_API_KEY: isServer ? z.string() : z.string().optional(),
  NODE_ENV: z.enum(["development", "staged", "production"]).default("development"),
})

export const env = clientEnvSchema.parse({
  ...process.env,

  /* Public Envs need to be explicit, because they are spreadable on client side */
  NEXT_PUBLIC_ORIGIN: process.env.NEXT_PUBLIC_ORIGIN,
})

export const IS_DEV = env.NODE_ENV === "development"

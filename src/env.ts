import { z } from 'zod'

export const envSchema = z.object({
  NEXT_PUBLIC_ORIGIN: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'staged', 'production']).default('development'),
})

export const env = envSchema.parse({
  ...process.env,

  /* Public Envs need to be explicit, because they are spreadable on client side */
  NEXT_PUBLIC_ORIGIN: process.env.NEXT_PUBLIC_ORIGIN,
})

export const IS_DEV = env.NODE_ENV === 'development'

import { env } from "@/env"
import { joinUrl } from "@/lib/url"
import axios from "axios"
import z from "zod"

const ACCESS_TOKEN_URL = env.QURAN_FOUNDATION_OAUTH_URL!
const API_URL = env.QURAN_FOUNDATION_API_URL!

const AccessResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  scope: z.string(),
})

export class QFSDK {
  private static instance: QFSDK | null = null

  private clientId: string
  private clientSecret: string

  private accessToken: string | null = null
  private tokenExpiry: number | null = null

  private constructor({ clientId, clientSecret }: { clientId: string; clientSecret: string }) {
    if (QFSDK.instance) throw new Error("Use QuranFoundation.getInstance() instead of new.")

    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  public static getInstance(config: { clientId: string; clientSecret: string }) {
    if (!QFSDK.instance) {
      QFSDK.instance = new QFSDK(config)
    }

    return QFSDK.instance
  }

  public async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    return this.fetchAccessToken()
  }

  private async fetchAccessToken() {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")

    const response = await axios.post(
      ACCESS_TOKEN_URL,
      "grant_type=client_credentials&scope=content",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )

    const result = AccessResponseSchema.parse(response.data)

    this.accessToken = result.access_token
    this.tokenExpiry = Date.now() + result.expires_in * 1000

    return this.accessToken
  }

  public async getChapters() {
    const accessToken = await this.getAccessToken()

    const response = await axios({
      method: "get",
      url: joinUrl(API_URL, "chapters"),
      headers: {
        "x-auth-token": accessToken,
        "x-client-id": this.clientId,
      },
    })

    return response.data
  }
}

export const quranSQK = QFSDK.getInstance({
  clientId: process.env.QURAN_FOUNDATION_CLIENT_ID!,
  clientSecret: process.env.QURAN_FOUNDATION_CLIENT_SECRET!,
})

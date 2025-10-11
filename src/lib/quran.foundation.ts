/* eslint-disable max-lines */

import { env } from "@/env"
import { joinUrl } from "@/lib/url"
import axios from "axios"
import { LRUCache } from "lru-cache"
import z from "zod"

const ACCESS_TOKEN_URL = env.QURAN_FOUNDATION_OAUTH_URL!
const API_URL = env.QURAN_FOUNDATION_API_URL!

export type VerseLevelField =
  | "chapter_id"
  | "text_indopak"
  | "text_imlaei_simple"
  | "text_imlaei"
  | "text_uthmani"
  | "text_uthmani_simple"
  | "text_uthmani_tajweed"
  | "text_qpc_hafs"
  | "qpc_uthmani_hafs"
  | "text_qpc_nastaleeq_hafs"
  | "text_qpc_nastaleeq"
  | "text_indopak_nastaleeq"
  | "image_url"
  | "image_width"
  | "code_v1"
  | "code_v2"
  | "page_number"
  | "v1_page"
  | "v2_page"

export type WordLevelField =
  | "verse_id"
  | "chapter_id"
  | "text_uthmani"
  | "text_indopak"
  | "text_imlaei_simple"
  | "text_imlaei"
  | "text_uthmani_simple"
  | "text_uthmani_tajweed"
  | "text_qpc_hafs"
  | "verse_key"
  | "location"
  | "code_v1"
  | "code_v2"
  | "v1_page"
  | "v2_page"
  | "line_number"
  | "line_v2"
  | "line_v1"

export type TranslationField =
  | "chapter_id"
  | "verse_number"
  | "verse_key"
  | "juz_number"
  | "hizb_number"
  | "rub_el_hizb_number"
  | "page_number"
  | "ruku_number"
  | "manzil_number"
  | "resource_name"
  | "language_name"
  | "language_id"
  | "id"
  | "text"

export interface GetVerseOptions {
  language?: string
  words?: boolean
  translations?: string
  audio?: number
  tafsirs?: string
  word_fields?: Partial<Record<WordLevelField, boolean>> | WordLevelField[]
  translation_fields?: Partial<Record<TranslationField, boolean>> | TranslationField[]
  fields?: Partial<Record<VerseLevelField, boolean>> | VerseLevelField[]
}

const AccessResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  scope: z.string(),
})

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace QuranFoundation {
  export interface Translation {
    resource_id: number
    resource_name: string
    id?: number
    text: string
    verse_id?: number
    language_id?: number
    language_name?: string
    verse_key?: string
    chapter_id?: number
    verse_number?: number
    juz_number?: number
    hizb_number?: number
    rub_number?: number
    page_number?: number
  }

  export interface Transliteration {
    text: string
    language_name: string
  }

  export interface AudioSegment {
    text: string
    language_name: string
  }

  export interface Audio {
    url: string
    duration?: number
    format?: string
    segments?: AudioSegment[]
  }

  export interface Word {
    id: number
    position: number
    text_uthmani?: string
    text_indopak?: string
    text_imlaei?: string
    verse_key?: string
    page_number?: number
    line_number?: number
    audio_url: string
    location?: string
    char_type_name: string
    code_v1?: string
    code_v2?: string
    translation: Translation
    transliteration: Transliteration
    v1_page?: number
    v2_page?: number
  }

  export interface Verse {
    id: number
    chapter_id?: number
    verse_number: number
    verse_key: string
    verse_index?: number
    text_uthmani?: string
    text_uthmani_simple?: string
    text_imlaei?: string
    text_imlaei_simple?: string
    text_indopak?: string
    text_indopak_nastaleeq?: string
    text_uthmani_tajweed?: string
    juz_number: number
    hizb_number: number
    rub_number: number
    page_number: number
    image_url?: string
    image_width?: number
    words: Word[]
    audio?: Audio
    translations?: Translation[]
    code_v1?: string
    code_v2?: string
    v1_page?: number
    v2_page?: number
  }

  export interface GetVerseByKeyResponse {
    verse: Verse
  }
}

const verseCache = new LRUCache<string, QuranFoundation.GetVerseByKeyResponse>({ max: 10000 })

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

  public async getTranslationResources() {
    const accessToken = await this.getAccessToken()

    const response = await axios<QuranFoundation.GetVerseByKeyResponse>({
      method: "get",
      url: joinUrl(API_URL, "resources/translations"),
      headers: {
        "x-auth-token": accessToken,
        "x-client-id": this.clientId,
      },
    })

    console.log("QF API Response:", JSON.stringify(response.data, null, 2)) // Debug: Show the response

    return response.data
  }

  public joinQueryParams(value: string[] | Record<string, boolean>): string {
    if (Array.isArray(value)) {
      return value.join(",")
    } else {
      return Object.entries(value)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(",")
    }
  }

  public async getVerse(key: string, options?: GetVerseOptions) {
    const Url = new URL(API_URL)

    Url.pathname = joinUrl(Url.pathname, "verses/by_key", key)

    const params = Url.searchParams

    if (options?.language) params.append("language", options.language)
    if (options?.words !== undefined) params.append("words", options.words.toString())
    if (options?.translations) params.append("translations", options.translations)
    if (options?.audio) params.append("audio", options.audio.toString())
    if (options?.tafsirs) params.append("tafsirs", options.tafsirs)

    if (options?.word_fields) {
      params.append("word_fields", this.joinQueryParams(options.word_fields!))
    }

    if (options?.translation_fields) {
      params.append("translation_fields", this.joinQueryParams(options.translation_fields!))
    }

    if (options?.fields) {
      params.append("fields", this.joinQueryParams(options.fields!))
    }

    const url = Url.toString()

    if (verseCache.has(url)) return verseCache.get(url)!

    const accessToken = await this.getAccessToken()

    const response = await axios<QuranFoundation.GetVerseByKeyResponse>({
      method: "get",
      url,
      headers: {
        "x-auth-token": accessToken,
        "x-client-id": this.clientId,
      },
    })

    verseCache.set(url, response.data)

    return response.data
  }
}

export const quranSQK = QFSDK.getInstance({
  clientId: env.QURAN_FOUNDATION_CLIENT_ID!,
  clientSecret: env.QURAN_FOUNDATION_CLIENT_SECRET!,
})

import { env } from "@/env"
import { Resolvers } from "@/gql/artifacts/resolvers"
import { quranSQK } from "@/lib/quran.foundation"
import { createHash } from "@/utils/hash"
import { calculateTTL } from "@/utils/ttl"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { LRUCache } from "lru-cache"
import { NextRequest } from "next/server"

const RATE_LIMIT = {
  WINDOW: 60 * 1000,  // 1 minute (in milliseconds)
  CACHE_SIZE: 10000  // Maximum number of IPs to track
}
const MAX_INPUT_LENGTH = 200 // characters


const rateLimitCache = new LRUCache<string, { count: number; lastRequest: number }>({ 
  max: RATE_LIMIT.CACHE_SIZE, 
  ttl: RATE_LIMIT.WINDOW 
})

const SYSTEM_PROMPT = `
You are an Islamic scholar assistant. Your task is to suggest relevant Quranic verses based on a user's emotional state, mood, or described situation.

Instructions:
- When given a mood, feeling, or a description of a difficult situation (example - family conflict, abuse, injustice), respond with a list of 1-10 verse keys, each on a new line, inside a <verse-keys> tag.
  - Minimum 1 verse (if only a few are truly relevant).
  - Maximum 10 verses.
  - Format each verse key as <surah_number>:<verse_number> (1:1).
- The most relevant and well-known verse for the mood or situation should come first in the list.
- Include a <mood-label> tag with a short, respectful description of the mood or situation (not technical).
- Do not include any explanations or extra text, only the verse keys in the specified format.

Example Output:
<mood-label>
Hope
</mood-label>
<verse-keys>
1:1
..
..
..
</verse-keys>

Guidelines for verse selection:
- Choose verses that offer spiritual comfort, hope, or guidance for the given mood.
- Select only verses that are relevant to the mood or situation described (less verses is better then more relevant ones).
- Avoid overly general verses; focus on those that directly address the emotional state or situation.
- For gratitude: verses about thankfulness and blessings.
- For hope: verses about Allah's mercy and optimism.
- For calm/peace: verses about tranquility and trust in Allah.
- For seeking forgiveness: verses about repentance and Allah's forgiveness.
- For anxiety/worry: verses about trust in Allah and relief from distress.
- For sadness: verses about patience and Allah's comfort.

Special Cases:
- If the mood is malicious, harmful, or not a feeling/mood, respond with verses about Allah's warning or punishment.
- If the mood is unclear, gibberish, or not understandable, respond with verses about confusion, seeking guidance, or Allah's knowledge.

Output Format:
- Include only the <mood-label> and <verse-keys> tags, and nothing else.
`

const aiResponseCache = new LRUCache<string, { verseKeys: string[]; mood: string }>({
  max: RATE_LIMIT.CACHE_SIZE,
  ttl: calculateTTL({ days: 2 }),
})

function cleanUpInput(input: string) {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input: mood must be a non-empty string')
  }
  
  if (input.length > MAX_INPUT_LENGTH) {
    throw new Error(`Input too long: maximum ${MAX_INPUT_LENGTH} characters allowed`)
  }

  // Remove any HTML tags and normalize whitespace
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

async function getVerseKeys(input: string) {
  if (!env.GEMINI_API_KEY) {
    throw new Error('API configuration error')
  }
  const hash = createHash(cleanUpInput(input))

  if (aiResponseCache.get(hash)) {
    return aiResponseCache.get(hash)!
  }

  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash-lite" })

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
                  <you-identity>
                    You are a helpful assistant that suggests Quranic verses based on a user's mood or emotional state, providing spiritual comfort and guidance.

                    <you-are>
                      Name: "Quran Mood Explorer"
                      Version: "0.1.0"
                      ReleaseAt: "2025-10-01"
                    </you-are>
                  </you-identity>

                  <system-prompt>
                  ${SYSTEM_PROMPT}
                  </system-prompt>
                  
                  <user-mood>
                   ${input}
                  </user-mood>
                  `,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
    },
  })

  const text = result.response.text()

  const verseKeyMatch = text.match(/<verse-keys>([\s\S]*?)<\/verse-keys>/)
  if (!verseKeyMatch) throw new Error("No verses found for this mood")

  const moodLabel = (text.match(/<mood-label>([\s\S]*?)<\/mood-label>/)?.[1] ?? input).trim()

  const verseKeys = verseKeyMatch[1]
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.match(/^\d+:\d+$/))

  const data = { verseKeys, mood: moodLabel }

  if (data.verseKeys.length === 0) throw new Error("No verses found for this mood")
  aiResponseCache.set(hash, data)

  return data
}

export const versesResolver: Resolvers<{ request: NextRequest; ip: string }> = {
  Query: {
    async getVersesByMood(_, { mood }, context) {
      const clientIp = context.ip
      const now = Date.now()

      const lastRequestTime = rateLimitCache.get(clientIp)
      if (lastRequestTime && now - lastRequestTime < RATE_LIMIT.WINDOW) {
        const remainingTime = Math.ceil((RATE_LIMIT.WINDOW - (now - lastRequestTime)) / 1000)
        throw new Error(
          `Rate limit exceeded wait ${remainingTime} seconds before making another request.`
        )
      }

      rateLimitCache.set(clientIp, now)

      const results = await getVerseKeys(mood).catch(() => {
        throw new Error("Usage limit reached. Try again shortly.")
      })

      const versePromises = results.verseKeys.map(async (key) => {
        const verse = await quranSQK.getVerse(key, {
          fields: {
            text_uthmani: true,
            chapter_id: true,
            text_indopak_nastaleeq: true,
          },
          translations: "161,85",
          translation_fields: {
            language_name: true,
            text: true,
          },
        })

        return {
          number: verse.verse.verse_number,

          scripts: [
            { name: "Indopak", text: verse.verse.text_indopak_nastaleeq! },
            { name: "Uthmani", text: verse.verse.text_uthmani! },
          ],

          translations: verse.verse.translations!.map((t) => ({
            languageId: t.language_name!,
            text: t.text,
          })),

          surah: {
            number: verse.verse.chapter_id,
          },
        }
      })

      const verseResults = await Promise.allSettled(versePromises)

      const verses = verseResults
        .map((result) => (result.status === "fulfilled" ? result.value! : null))
        .filter((verse) => verse !== null)

      if (verses.length === 0) throw new Error("No verses could be fetched for this mood")

      const finalResult = { verses, mood: results.mood }
      rateLimitCache.set(clientIp, now)

      return finalResult
    },
  },
}

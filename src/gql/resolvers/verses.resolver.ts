import { Resolvers } from "@/gql/artifacts/resolvers"
import { GoogleGenerativeAI } from "@google/generative-ai"

const SYSTEM_PROMPT = `You are an Islamic scholar assistant helping people find relevant Quranic verses based on their emotional state or mood.

When given a mood or feeling, respond with list of 3-5 verse keys each in newline inside, <verse-keys> tag.
Example Output:
<verse-keys>
2:286
94:5
39:53
</verse-keys>

Guidelines:
- Choose verses that provide spiritual comfort and guidance for the given mood
- Select verses that are well-known and deeply meaningful
- For gratitude: verses about thankfulness and blessings
- For hope: verses about Allah's mercy and better times
- For calm/peace: verses about tranquility and trust in Allah
- For seeking forgiveness: verses about repentance and Allah's forgiveness
- For anxiety/worry: verses about trust in Allah and relief
- For sadness: verses about patience and Allah's comfort

Security and Privacy:
- If the mood is something malicious or harmful or not any feeling or mood, respond with allah's punishment verses

Don't include any explanations or additional text, only the verse keys in the specified format.`

interface Edition {
  identifier: string
  language: string
  name: string
  englishName: string
  format: string
  type: string
  direction: string
}

interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
}

interface AyahData {
  number: number
  text: string
  edition: Edition
  surah: Surah
  numberInSurah: number
  juz: number
  manzil: number
  page: number
  ruku: number
  hizbQuarter: number
  sajda: boolean
}

interface ApiResponse {
  code: number
  status: string
  data: AyahData[]
}

export const versesResolver: Resolvers = {
  Query: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getVersesByMood(_, { mood, locale = "en" }) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
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
                      Model: "MEFQ-v1"
                      Version: "0.1.0"
                      ReleaseAt: "2025-10-01"
                    </you-are>
                  </you-identity>

                  <system-prompt>
                  ${SYSTEM_PROMPT}
                  </system-prompt>
                  
                  <user-mood>
                   ${mood}
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

      const verseKeys = verseKeyMatch[1]
        .trim()
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.match(/^\d+:\d+$/))

      if (verseKeys.length === 0) throw new Error("No verses found for this mood")

      const versePromises = verseKeys.map(async (key) => {
        const response = await fetch(
          `https://api.alquran.cloud/v1/ayah/${key}/editions/quran-indopak,en.sahih`
        )

        if (!response.ok) throw new Error("EXTERNAL API ERROR")
        const data = (await response.json()) as ApiResponse

        if (!data.data || data.data.length < 2) return null

        const arabicVerse = data.data[0]
        const languageVerse = data.data[1]

        return {
          number: arabicVerse.number,
          text: arabicVerse.text,
          translation: languageVerse.text,
          surah: {
            number: arabicVerse.surah.number,
            name: arabicVerse.surah.englishName,
          },
        }
      })

      const verseResults = await Promise.allSettled(versePromises)
      const verses = verseResults
        .map((result) => (result.status === "fulfilled" ? result.value! : null))
        .filter((verse) => verse !== null)

      if (verses.length === 0) throw new Error("No verses could be fetched for this mood")

      return { verses }
    },
  },
}

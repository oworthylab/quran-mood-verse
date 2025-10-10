import { gql } from "@gql/artifacts/gql"

export const GET_VERSES_BY_MOOD = gql(`
  query GetVersesByMood($mood: String!, $locale: String) {
    getVersesByMood(mood: $mood, locale: $locale) {
      mood
      verses {
        number
        text
        translation
        surah {
          number
          name
        }
      }
    }
  }
`)

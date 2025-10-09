import { gql } from "@gql/artifacts/gql"

export const GET_VERSES_BY_MOOD = gql(`
  query GetVersesByMood($mood: String!) {
    getVersesByMood(mood: $mood) {
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

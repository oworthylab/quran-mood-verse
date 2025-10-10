import { gql } from "@gql/artifacts/gql"

export const GET_VERSES_BY_MOOD = gql(`
  query GetVersesByMood($mood: String!) {
    getVersesByMood(mood: $mood) {
      mood
      verses {
        number
        surah {
          number
        }
        
        scripts {
          name
          text
        }
        
        translations {
          languageId
          text
        }
      }
    }
  }
`)

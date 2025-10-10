import { gql } from "graphql-tag"

export const typeDefs = gql`
  scalar DateTime

  type Surah {
    number: Int!
  }

  type Translation {
    languageId: String!
    text: String!
  }

  type Script {
    name: String!
    text: String!
  }

  type Verse {
    number: Int!
    scripts: [Script!]!
    translations: [Translation!]!
    surah: Surah!
  }

  type VerseResponse {
    mood: String!
    verses: [Verse!]!
  }

  type Query {
    _random: Float!
    getVersesByMood(mood: String!, locale: String): VerseResponse!
  }
`

import { gql } from "graphql-tag"

export const typeDefs = gql`
  scalar DateTime

  type Surah {
    number: Int!
    name: String! # Language Name
  }

  type Verse {
    number: Int!
    text: String!
    translation: String!
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

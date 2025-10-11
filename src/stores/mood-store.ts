/* eslint-disable react-func/max-lines-per-function */

import { create } from "zustand"
import { combine, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

import z from "zod"

export const VerseSchema = z.object({
  number: z.number(),
  surah: z.object({ number: z.number() }),

  scripts: z.array(
    z.object({
      name: z.string(),
      text: z.string(),
    })
  ),

  translations: z.array(
    z.object({
      languageId: z.string(),
      text: z.string(),
    })
  ),
})

export type Verse = z.infer<typeof VerseSchema>

export const useMoodStore = create(
  persist(
    immer(
      combine(
        {
          mood: "",
          currentMood: "",
          savedVerses: [] as Verse[],
          submitError: null as string | null,
        },
        (set) => ({
          setMood(mood: string) {
            set((store) => {
              store.mood = mood
            })
          },

          setCurrentMood(currentMood: string) {
            set((store) => {
              store.currentMood = currentMood
            })
          },

          setSavedVerses(verses: Verse[]) {
            set((store) => {
              store.savedVerses = verses
            })
          },

          setSubmitError(error: string | null) {
            set((store) => {
              store.submitError = error
            })
          },

          updateVersesResult(verses: Verse[], mood: string) {
            set((store) => {
              store.savedVerses = verses
              store.currentMood = mood
              store.submitError = null
            })
          },

          clearMoodState() {
            set((store) => {
              store.mood = ""
              store.currentMood = ""
              store.savedVerses = []
              store.submitError = null
            })
          },
        })
      )
    ),
    {
      name: "quran-mood-explorer-state",
      partialize: (state) => ({
        currentMood: state.currentMood,
        savedVerses: state.savedVerses,
      }),
    }
  )
)

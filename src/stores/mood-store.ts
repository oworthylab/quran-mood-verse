import { create } from "zustand"
import { persist } from "zustand/middleware"

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

interface MoodState {
  mood: string
  currentMood: string
  savedVerses: Verse[]
  submitError: string | null
}

interface MoodActions {
  setMood: (mood: string) => void
  setCurrentMood: (currentMood: string) => void
  setSavedVerses: (verses: Verse[]) => void
  setSubmitError: (error: string | null) => void
  updateVersesResult: (verses: Verse[], mood: string) => void
  clearMoodState: () => void
}

type MoodStore = MoodState & MoodActions

export const useMoodStore = create<MoodStore>()(
  persist(
    (set) => ({
      mood: "",
      currentMood: "",
      savedVerses: [],
      submitError: null,
      setMood: (mood) => set({ mood }),
      setCurrentMood: (currentMood) => set({ currentMood }),
      setSavedVerses: (verses) => set({ savedVerses: verses }),
      setSubmitError: (error) => set({ submitError: error }),
      updateVersesResult: (verses, mood) =>
        set({ savedVerses: verses, currentMood: mood, submitError: null }),
      clearMoodState: () => set({ mood: "", currentMood: "", savedVerses: [], submitError: null }),
    }),
    {
      name: "quran-mood-explorer-state",
      partialize: (state) => ({
        currentMood: state.currentMood,
        savedVerses: state.savedVerses,
      }),
    }
  )
)

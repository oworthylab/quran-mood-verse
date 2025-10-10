"use client"

/* eslint-disable max-lines */

import { LanguageSwitch } from "@/components/shared/language-switch"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { GET_VERSES_BY_MOOD } from "@/gql/queries/verses.query"
import { useLazyQuery } from "@apollo/client"
import { ArrowUp, Loader2, Sparkles } from "lucide-react"
import { useLocale } from "next-intl"
import { useState } from "react"
import z from "zod"

const verseSchema = z.object({
  text: z.string(),
  translation: z.string(),
  number: z.number(),
  surah: z.object({
    name: z.string(),
    number: z.number(),
  }),
})

const versesSchema = z.array(verseSchema)

type Verse = z.infer<typeof verseSchema>

const LOCAL_STORAGE_QURAN_MOOD_VERSES_KEY = "QURAN_MOOD_VERSES"

const localeStorageSchema = z.object({
  verses: versesSchema,
  mood: z.string(),
  timestamp: z.coerce.number(),
})

function setLocaleVerses(verses: Verse[], mood: string) {
  const versesToSave = {
    verses: verses,
    mood: mood,
    timestamp: Date.now(),
  }

  localStorage.setItem(
    LOCAL_STORAGE_QURAN_MOOD_VERSES_KEY,
    JSON.stringify(localeStorageSchema.parse(versesToSave))
  )

  return versesToSave
}

function getLocaleVerses() {
  if (typeof window === "undefined") return undefined

  const data = localStorage.getItem(LOCAL_STORAGE_QURAN_MOOD_VERSES_KEY)
  if (!data) return undefined

  const result = localeStorageSchema.safeParse(JSON.parse(data))
  if (!result.success) return undefined

  return result.data
}

const MOOD_PRESETS = [
  { label: "Grateful", emoji: "✨" },
  { label: "Seeking Forgiveness", emoji: "💫" },
  { label: "Anxious", emoji: "😰" },
  { label: "Sad", emoji: "😔" },
  { label: "Angry", emoji: "😡" },
]

const initialState = getLocaleVerses()

console.log(initialState)

export function QuranMoodExplorer() {
  const locale = useLocale()

  const [mood, setMood] = useState("")
  const [currentMood, setCurrentMood] = useState(initialState?.mood ?? "")
  const [savedVerses, setSavedVerses] = useState<Array<Verse>>(initialState?.verses ?? [])

  const [getVerses, { loading, error, data }] = useLazyQuery(GET_VERSES_BY_MOOD, {})

  async function handleSubmit(moodInput: string) {
    const mood = moodInput.trim()
    if (!mood) return
    setCurrentMood(mood)

    const { data } = await getVerses({ variables: { mood, locale } })

    if (data?.getVersesByMood?.verses && data.getVersesByMood.verses.length > 0) {
      setLocaleVerses(data.getVersesByMood.verses, mood)
      setSavedVerses(data.getVersesByMood.verses)
    }
  }

  function handleChangeMood() {
    setMood("")
    setSavedVerses([])
    localStorage.removeItem(LOCAL_STORAGE_QURAN_MOOD_VERSES_KEY)
  }

  const verses = savedVerses.length > 0 ? savedVerses : data?.getVersesByMood?.verses || []

  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-b">
      <LanguageSwitch />

      {verses.length <= 0 ? (
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2">
              <Sparkles className="text-primary h-8 w-8" />
              <h1 className="text-4xl font-bold text-balance">Quran Verse Mood Explorer</h1>
            </div>
            <p className="text-muted-foreground text-lg text-pretty">
              Find spiritual comfort through verses that resonate with your current state of mind
            </p>
          </div>
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
            <PromptInput
              value={mood}
              onValueChange={(value) => setMood(value.slice(0, 200))}
              isLoading={loading}
              onSubmit={() => void handleSubmit(mood)}
            >
              <PromptInputTextarea
                placeholder="How are you feeling today?"
                className="placeholder:text-muted-foreground/60 text-foreground text-base"
              />
              <PromptInputActions className="items-center justify-between">
                <div className="text-muted-foreground ml-2 text-xs">{mood.length}/200</div>
                <PromptInputAction tooltip={loading ? "Finding verses..." : "Find verses"}>
                  <Button
                    variant="default"
                    size="icon"
                    className="h-10 w-10 rounded-full shadow-md transition-all duration-200 hover:shadow-lg"
                    disabled={loading || !mood.trim()}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <ArrowUp className="h-5 w-5" />
                    )}
                  </Button>
                </PromptInputAction>
              </PromptInputActions>
            </PromptInput>

            <div className="flex flex-wrap justify-center gap-3">
              {MOOD_PRESETS.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMood(preset.label)
                    void handleSubmit(preset.label)
                  }}
                  disabled={loading}
                  className="border-muted-foreground/20 hover:border-primary hover:bg-primary/5 hover:text-primary gap-2 rounded-full px-4 py-2 transition-all duration-200"
                >
                  <span className="text-base">{preset.emoji}</span>
                  <span className="font-medium">{preset.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-semibold">Verses for your soul</h2>
            {currentMood && (
              <p className="text-muted-foreground">
                Based on your mood: <span className="font-medium">{currentMood}</span>
              </p>
            )}
          </div>
          {error && (
            <Card className="bg-destructive/10 border-destructive/20 mb-8 p-4">
              <p className="text-destructive text-sm">
                {error.message || "Something went wrong while fetching verses"}
              </p>
            </Card>
          )}
          <div className="space-y-6">
            {verses.map((verse) => (
              <Card
                key={`${verse.surah.number}-${verse.number}`}
                className="p-6 shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="space-y-4">
                  <div className="text-muted-foreground flex items-center justify-between text-sm">
                    <span className="font-medium">({verse.surah.name})</span>
                    <span>
                      Surah {verse.surah.number}, Verse {verse.number}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-2xl leading-loose" dir="rtl">
                      {verse.text}
                    </p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-foreground/90 text-base leading-relaxed">
                      {verse.translation}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button
              onClick={handleChangeMood}
              variant="outline"
              className="border-primary/20 hover:border-primary hover:bg-primary/5 hover:text-primary gap-2 px-6 py-3 transition-all duration-200"
            >
              <Sparkles className="h-4 w-4" />
              Mood changed?
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

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
import { ArrowUp, Loader2, Sparkles, SquareArrowOutUpRight } from "lucide-react"
import { useLocale } from "next-intl"
import { Fragment, useState } from "react"
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
  { label: "Sad", emoji: "😔" },
  { label: "Seeking Forgiveness", emoji: "💫" },
  { label: "Anxious", emoji: "😰" },
  { label: "Angry", emoji: "😡" },
]

const initialState = getLocaleVerses()

export function QuranMoodExplorer() {
  const locale = useLocale()

  const [mood, setMood] = useState("")
  const [currentMood, setCurrentMood] = useState(initialState?.mood ?? "")
  const [savedVerses, setSavedVerses] = useState<Array<Verse>>(initialState?.verses ?? [])
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [getVerses, { loading }] = useLazyQuery(GET_VERSES_BY_MOOD)

  async function handleSubmit(moodInput: string) {
    const mood = moodInput.trim()
    if (!mood) return

    setSubmitError(null)

    try {
      const { data, errors } = await getVerses({ variables: { mood, locale }, errorPolicy: "all" })
      console.log({ data, errors })
      const error = errors ? errors[0]! : undefined

      if (error) {
        return setSubmitError(error.message || "Something went wrong while fetching verses")
      }

      if (data?.getVersesByMood?.verses && data.getVersesByMood.verses.length > 0) {
        setCurrentMood(data.getVersesByMood.mood)
        setLocaleVerses(data.getVersesByMood.verses, data.getVersesByMood.mood)
        setSavedVerses(data.getVersesByMood.verses)
      } else {
        setSubmitError("No verses found for your mood.")
      }
    } catch (_err) {
      setSubmitError("Something went wrong while fetching verses.")
    }
  }

  function handleChangeMood() {
    setMood("")
    setSavedVerses([])
    localStorage.removeItem(LOCAL_STORAGE_QURAN_MOOD_VERSES_KEY)
  }

  const verses = savedVerses.length > 0 ? savedVerses : []

  return (
    <div>
      <LanguageSwitch />

      {verses.length <= 0 ? (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="mt-[-15%] text-center">
            <div className="mb-6 inline-flex items-center gap-2 text-center text-2xl">
              Discover comfort in verses that speak to you
            </div>

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
              <PromptInput
                value={mood}
                onValueChange={(value) => {
                  setMood(value.slice(0, 200))
                  if (submitError) setSubmitError(null)
                }}
                isLoading={loading}
                onSubmit={() => void handleSubmit(mood)}
              >
                <PromptInputTextarea
                  placeholder="How are you feeling today?"
                  className="placeholder:text-muted-foreground/60 text-foreground text-base"
                  disabled={loading}
                />
                <PromptInputActions className="items-center justify-between">
                  <div className="text-muted-foreground ml-2 text-xs">{mood.length}/200</div>
                  <PromptInputAction tooltip={loading ? "Finding verses..." : "Find verses"}>
                    <Button
                      variant="default"
                      size="icon"
                      className="h-10 w-10 rounded-full shadow-md transition-all duration-200 hover:shadow-lg"
                      disabled={loading || !mood.trim()}
                      onClick={() => void handleSubmit(mood)}
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

              {submitError && (
                <Card className="bg-destructive/10 border-destructive/20 p-4">
                  <p className="text-destructive text-sm">{submitError}</p>
                </Card>
              )}

              <div className="flex flex-wrap justify-center gap-2">
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
        </div>
      ) : (
        <div className="my-8 flex flex-col gap-8">
          <div className="flex flex-col gap-1 text-center">
            <h2 className="text-2xl font-semibold">Verses for your soul</h2>
            {currentMood && (
              <p className="text-muted-foreground">
                Based on your mood: <span className="font-medium">{currentMood}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-8">
            {verses.map((verse, index) => (
              <Fragment key={`${verse.surah.number}-${verse.number}`}>
                <div key={`${verse.surah.number}-${verse.number}`} className="relative">
                  <div className="flex flex-col gap-8">
                    <div className="flex justify-end">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://quran.com/${verse.surah.number}?startingVerse=${verse.number}`}
                        className="bg-primary/80 text-primary-foreground inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium"
                      >
                        {verse.surah.number}:{verse.number}{" "}
                        <SquareArrowOutUpRight className="size-3.5" />
                      </a>
                    </div>
                    <div className="text-right">
                      <p className="font-arabic text-4xl leading-relaxed" dir="rtl">
                        {verse.text}
                      </p>
                    </div>
                    <div>
                      <p className="text-foreground/90 text-base leading-loose">
                        {verse.translation}
                      </p>
                    </div>
                  </div>
                </div>
                {index < verses.length - 1 && <div className="border-muted/20 border-b" />}
              </Fragment>
            ))}
          </div>

          <div className="my-4 text-center">
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

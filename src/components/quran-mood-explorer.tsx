"use client"

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

const MOOD_PRESETS = [
  { label: "Grateful", emoji: "✨" },
  { label: "Seeking Forgiveness", emoji: "💫" },
  { label: "Anxious", emoji: "😰" },
  { label: "Sad", emoji: "😔" },
  { label: "Angry", emoji: "😡" },
]

export function QuranMoodExplorer() {
  const [mood, setMood] = useState("")
  const locale = useLocale()

  const [getVerses, { loading, error, data }] = useLazyQuery(GET_VERSES_BY_MOOD, {
    errorPolicy: "all",
  })

  async function handleSubmit(moodInput: string) {
    if (!moodInput.trim()) return
    await getVerses({ variables: { mood: moodInput.trim(), locale } })
  }

  const verses = data?.getVersesByMood?.verses || []

  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-b">
      <LanguageSwitch />
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <Sparkles className="text-primary h-8 w-8" />
            <h1 className="text-4xl font-bold text-balance">Quran Verse Mood Explorer</h1>
          </div>
          <p className="text-muted-foreground text-lg text-pretty">
            Find spiritual comfort through verses that resonate with your current state of mind
          </p>
        </div>

        <div className="mx-auto flex max-w-2xl flex-col gap-4">
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

        {error && (
          <Card className="bg-destructive/10 border-destructive/20 mb-8 p-4">
            <p className="text-destructive text-sm">
              {error.message || "Something went wrong while fetching verses"}
            </p>
          </Card>
        )}

        {verses.length > 0 && (
          <div className="space-y-6">
            <h2 className="mb-6 text-center text-2xl font-semibold">Verses for your soul</h2>
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
        )}

        {loading && (
          <div className="py-12 text-center">
            <Loader2 className="text-primary mx-auto mb-4 h-12 w-12 animate-spin" />
            <p className="text-muted-foreground">Searching for the perfect verses...</p>
          </div>
        )}
      </div>
    </div>
  )
}

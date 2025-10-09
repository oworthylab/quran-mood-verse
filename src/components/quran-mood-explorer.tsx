"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { GET_VERSES_BY_MOOD } from "@/gql/queries/verses.query"
import { useLazyQuery } from "@apollo/client"
import { Loader2, Sparkles } from "lucide-react"
import { Fragment, useState } from "react"

const MOOD_PRESETS = [
  { label: "Grateful", emoji: "🙏" },
  { label: "Hopeful", emoji: "✨" },
  { label: "Calm", emoji: "🕊️" },
  { label: "Seeking Forgiveness", emoji: "💫" },
  { label: "Anxious", emoji: "😰" },
  { label: "Sad", emoji: "😔" },
]

export function QuranMoodExplorer() {
  const [mood, setMood] = useState("")

  const [getVerses, { loading, error, data }] = useLazyQuery(GET_VERSES_BY_MOOD, {
    errorPolicy: "all",
  })

  async function handleSubmit(moodInput: string) {
    if (!moodInput.trim()) return
    await getVerses({ variables: { mood: moodInput.trim() } })
  }

  const verses = data?.getVersesByMood?.verses || []

  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-b">
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

        <Card className="mb-8 p-6 shadow-lg">
          <div className="space-y-4">
            <div>
              <label htmlFor="mood-input" className="mb-2 block text-sm font-medium">
                How are you feeling today?
              </label>
              <Textarea
                id="mood-input"
                placeholder="Describe your mood or feelings... (max 200 characters)"
                value={mood}
                onChange={(e) => setMood(e.target.value.slice(0, 200))}
                maxLength={200}
                rows={3}
                className="resize-none"
              />
              <div className="text-muted-foreground mt-1 text-right text-xs">{mood.length}/200</div>
            </div>

            <Button
              onClick={() => void handleSubmit(mood)}
              disabled={loading || !mood.trim()}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <Fragment>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding verses...
                </Fragment>
              ) : (
                "Find Verses"
              )}
            </Button>

            <div className="border-t pt-4">
              <p className="text-muted-foreground mb-3 text-sm">Or choose a mood:</p>
              <div className="flex flex-wrap gap-2">
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
                    className="gap-2"
                  >
                    <span>{preset.emoji}</span>
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

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

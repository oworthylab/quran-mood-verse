import { create } from "zustand"
import { combine, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

export type ScriptType = "indopak" | "uthmani"

export const useScriptStore = create(
  persist(
    immer(
      combine({ script: "indopak" }, (set) => ({
        setScript(script: ScriptType) {
          set((store) => {
            store.script = script
          })
        },
      }))
    ),
    { name: "quran-script-preference" }
  )
)

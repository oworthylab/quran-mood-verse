import { cn } from "@/lib/utils"
import styles from "./index.module.css"

type CSSUnitTypes = "px" | "rem" | "em" | "%" | "vh" | "vw" | "vmin" | "vmax"
type CSSUnit = `${number}${CSSUnitTypes}` | `var(--${string})`

interface GlowingBorderProps extends React.ComponentPropsWithoutRef<"div"> {
  size?: CSSUnit
  round?: CSSUnit
  always?: boolean
  onHover?: boolean
}

export function GlowingEdge({
  children,
  className,
  size = "0.5rem",
  round = "0.5rem",
  always: enabled = false,
  onHover = false,
  style,
  ...props
}: GlowingBorderProps) {
  return (
    <div
      className={cn("group relative isolate z-10", className)}
      {...props}
      style={
        {
          "--_size": size,
          "--_round": round,
          ...style,
        } as React.CSSProperties
      }
    >
      <div
        className={cn("absolute isolate -z-10 flex overflow-hidden")}
        style={{
          inset: `calc(var(--_size) * -1)`,
          borderRadius: `calc(var(--_round) + var(--_size))`,
        }}
      >
        <div
          className={cn(styles.glow, "h-full w-full blur-2xl filter", {
            "before:!opacity-100": enabled,
            "group-hover:before:!opacity-100": onHover,
          })}
        />
      </div>

      {children}
    </div>
  )
}

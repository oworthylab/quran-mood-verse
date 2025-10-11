import { routing } from "@/i18n/routing"
import { Formats, hasLocale } from "next-intl"
import { getRequestConfig } from "next-intl/server"

export const formats = {
  dateTime: {
    short: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  },
  number: {
    fixed: {
      minimumIntegerDigits: 2,
      useGrouping: false,
      maximumFractionDigits: 2,
    },
  },
  list: {
    enumeration: {
      style: "long",
      type: "conjunction",
    },
  },
} satisfies Formats

// eslint-disable-next-line import/no-default-export
export default getRequestConfig(async (context) => {
  const requested = await context.requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    formats,
  }
})

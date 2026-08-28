import type { Metadata } from "next"

export const constructMetadata = ({
  title = "JV notes",
  description = "Aplicativo pessoal de notas online.",
  noIndex = false,
}: {
  title?: string
  description?: string
  noIndex?: boolean
} = {}): Metadata => ({
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://jvlc.cc"),
  ...(noIndex && {
    robots: {
      index: false,
      follow: false,
    },
  }),
})

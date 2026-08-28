const normalizeUrl = (value?: string) => value?.replace(/\/$/, "")

const isSupabaseUrl = (value?: string) => {
  if (!value) return false
  try {
    return new URL(value).hostname.endsWith(".supabase.co")
  } catch {
    return false
  }
}

const configuredAppUrl = normalizeUrl(process.env.NEXT_PUBLIC_APP_URL)
const configuredSupabaseUrl = normalizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)

// The current Vercel project still has two legacy public URL variables with
// swapped values. Prefer semantically valid values so production remains safe
// until those dashboard variables are corrected.
export const supabaseUrl =
  [configuredSupabaseUrl, configuredAppUrl].find(isSupabaseUrl) ??
  (() => {
    throw new Error("Missing a valid Supabase URL in public environment variables")
  })()

export const appUrl =
  configuredAppUrl && !isSupabaseUrl(configuredAppUrl)
    ? configuredAppUrl
    : process.env.NODE_ENV === "production"
      ? "https://jvlc.cc"
      : "http://localhost:3000"

export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  (() => {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    )
  })()

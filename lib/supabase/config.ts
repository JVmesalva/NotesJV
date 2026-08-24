const FALLBACK_SUPABASE_URL = "https://eaidmzuwhzdcepedenlo.supabase.co"
const FALLBACK_SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_2Hte0aDw-WFsQGR7Inxfkg_sRsbwpqp"

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const envKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const hasValidSupabaseUrl =
  typeof envUrl === "string" && /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(envUrl)

export const supabaseUrl = hasValidSupabaseUrl ? envUrl! : FALLBACK_SUPABASE_URL
export const supabasePublishableKey =
  hasValidSupabaseUrl && envKey ? envKey : FALLBACK_SUPABASE_PUBLISHABLE_KEY

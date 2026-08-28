const productionAppUrl = "https://jvlc.cc"
const defaultSupabaseUrl = "https://eaidmzuwhzdcepedenlo.supabase.co"
const defaultSupabasePublishableKey = "sb_publishable_2Hte0aDw-WFsQGR7Inxfkg_sRsbwpqp"

export const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.NODE_ENV === "production" ? productionAppUrl : "http://localhost:3000")

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? defaultSupabaseUrl

export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  defaultSupabasePublishableKey

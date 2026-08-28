const requiredEnv = (value: string | undefined, name: string): string => {
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

export const appUrl = requiredEnv(process.env.NEXT_PUBLIC_APP_URL, "NEXT_PUBLIC_APP_URL")

export const supabaseUrl = requiredEnv(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  "NEXT_PUBLIC_SUPABASE_URL",
)

export const supabasePublishableKey = requiredEnv(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY",
)

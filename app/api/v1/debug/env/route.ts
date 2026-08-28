import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? null,
    supabaseHost: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : null,
    keyVariable: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      ? "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        : null,
  })
}

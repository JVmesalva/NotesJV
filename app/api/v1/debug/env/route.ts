import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    appUrl: Boolean(process.env.NEXT_PUBLIC_APP_URL),
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabasePublishableKey: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
  })
}

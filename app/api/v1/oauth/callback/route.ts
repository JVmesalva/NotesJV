import { createClient } from "@/lib/supabase/server"
import { appUrl } from "@/lib/supabase/config"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")
  const successUrl = new URL("/doc", appUrl)
  const failureUrl = new URL("/login", appUrl)

  if (!code) return NextResponse.redirect(failureUrl)

  const server = createClient(cookies())
  const { data, error } = await server.auth.exchangeCodeForSession(code)

  if (!error && data.session) return NextResponse.redirect(successUrl)

  return NextResponse.redirect(failureUrl)
}

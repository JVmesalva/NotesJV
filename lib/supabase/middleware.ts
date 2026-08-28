import "server-only"

import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"
import { type Database } from "@/lib/supabase/database.types"
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config"

export const createClient = (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database, "public", Database["public"]>(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })

          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })

          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options })

          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })

          response.cookies.set({ name, value: "", ...options })
        },
      },
    },
  )

  return { supabase, response }
}

import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "./lib/supabase/middleware"

const protectedRoutes = ["/doc", "/reset-password", "/settings"]
const privateRoutes = ["/login", "/signup", "/forgot-password"]

const copySessionCookies = (target: NextResponse, source: NextResponse) => {
  source.cookies.getAll().forEach(cookie => target.cookies.set(cookie))
  return target
}

const routeUrl = (request: NextRequest, pathname: string) => {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  url.search = ""
  return url
}

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl

  // teste.jvlc.cc is a public visual-only preview for Google Stitch.
  // It never enters the authenticated app or exposes user data.
  if (hostname === "teste.jvlc.cc") {
    if (pathname === "/") {
      return NextResponse.rewrite(routeUrl(request, "/stitch"))
    }

    if (pathname === "/stitch" || pathname.startsWith("/assets/")) {
      return NextResponse.next()
    }

    return NextResponse.redirect(routeUrl(request, "/"))
  }

  const { supabase, response } = createClient(request)

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const { data } = await supabase.auth.getSession()

  const hasSession = Boolean(data.session)

  // jvlc.cc is the app home. Logged-out visitors go to login; logged-in
  // visitors see the existing /doc dashboard while the browser keeps "/".
  if (pathname === "/") {
    if (!hasSession) {
      return copySessionCookies(
        NextResponse.redirect(routeUrl(request, "/login")),
        response,
      )
    }

    return copySessionCookies(NextResponse.rewrite(routeUrl(request, "/doc")), response)
  }

  if (!hasSession && protectedRoutes.some(r => pathname.startsWith(r))) {
    return copySessionCookies(
      NextResponse.redirect(routeUrl(request, "/login")),
      response,
    )
  }

  if (hasSession && privateRoutes.some(r => pathname.startsWith(r))) {
    return copySessionCookies(NextResponse.redirect(routeUrl(request, "/")), response)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
     */
    "/((?!api/|_next/|_proxy/|_static|[\\w-]+\\.\\w+).*)",
  ],
}

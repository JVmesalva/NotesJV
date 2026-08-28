import { PropsWithChildren } from "react"

import { ThemeProvider } from "@/components/provider/theme.provider"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import LayoutWrapper from "./_components/layout-wrapper"

export default async function MainLayout({ children }: PropsWithChildren) {
  const cookiesStore = await cookies()
  const server = createClient(cookiesStore)

  const { data } = await server.auth.getUser()
  if (!data.user) return redirect("/login")

  const { data: profile } = await server
    .from("profiles")
    .select("username, fullname")
    .single()

  if (!profile?.fullname || !profile?.username) return redirect("/complete-signup")

  return (
    <LayoutWrapper currentUser={data.user}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
        storageKey="station-theme"
      >
        {children}
      </ThemeProvider>
    </LayoutWrapper>
  )
}

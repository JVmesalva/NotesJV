import React from "react"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import CompleteSignUpPage from "./complete-signup"

export default async function CompleteSignUpRootPage() {
  const cookiesStore = await cookies()
  const server = createClient(cookiesStore)

  const { data: profile } = await server
    .from("profiles")
    .select("username, fullname")
    .single()

  if (profile?.fullname && profile?.username) return redirect("/")

  return <CompleteSignUpPage />
}

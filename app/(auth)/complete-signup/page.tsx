import React from "react"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { type Database } from "@/lib/supabase/database.types"
import { redirect } from "next/navigation"
import CompleteSignUpPage from "./complete-signup"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export default async function CompleteSignUpRootPage() {
  const cookiesStore = await cookies()
  const server = createClient(cookiesStore)

  const { data } = await server.from("profiles").select("*").single()
  const profile = data as Profile | null

  if (profile?.fullname && profile?.username) return redirect("/")

  return <CompleteSignUpPage />
}

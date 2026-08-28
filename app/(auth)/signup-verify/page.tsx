import { redirect } from "next/navigation"
import { emailSchema } from "./_schema"
import SignUpVerifyPage from "./signup-verify"

type Props = {
  searchParams: Promise<{ mailto?: string }>
}

export default async function SignUpVerifyRootPage({ searchParams }: Props) {
  const params = await searchParams
  const email = emailSchema.safeParse(params.mailto)

  if (!email.success) return redirect("/signup")

  return <SignUpVerifyPage />
}

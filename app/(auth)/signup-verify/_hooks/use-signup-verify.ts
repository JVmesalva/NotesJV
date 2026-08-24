import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { useCountdown } from "usehooks-ts"
import { useAuthStore } from "@/store/use-auth-store"

export default function useSignUpVerify() {
  const params = useSearchParams()
  const email = params.get("mailto")
  const { resendOtpAsync } = useAuthStore()
  const [error, setError] = useState<string>()
  const [isResending, setIsResending] = useState(false)

  const [count, { startCountdown }] = useCountdown({
    countStart: 60,
  })
  const showCountdown = count !== 0 && count < 60

  const resendHandler = async () => {
    if (!email || isResending || showCountdown) return

    setIsResending(true)
    setError(undefined)

    const res = await resendOtpAsync({ email })

    if (res?.error) setError(res.error)
    else startCountdown()

    setIsResending(false)
  }

  return {
    email,
    error,
    isResending,
    resendHandler,
    showCountdown,
    count,
  }
}

"use client"

import ErrorBlock from "@/components/error-block"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LoaderIcon, MailCheckIcon } from "lucide-react"
import useSignUpVerify from "./_hooks/use-signup-verify"

export default function SignUpVerifyPage() {
  const { email, error, isResending, resendHandler, showCountdown, count } = useSignUpVerify()

  return (
    <>
      <MailCheckIcon className="mb-4 h-16 w-16" />

      <h1 className="mb-2 text-2xl font-bold md:text-3xl">Check your email</h1>

      <p className="mb-8 w-full text-center text-sm">
        To complete your signup, open the confirmation link we sent to{" "}
        {email ? <strong>{email}</strong> : "your email address"}. After confirming, you&apos;ll be
        redirected back to JV Notes automatically.
      </p>

      <ErrorBlock message={error} />

      <hr className="my-8 w-full" />

      <div className="w-full text-left text-sm">
        <p className="mb-2 font-medium">Didn&apos;t receive the email?</p>
        <ol className="list-inside list-disc">
          <li>Check your spam or junk folder.</li>
          <li>
            <Button
              variant="link-blue"
              className={cn("h-auto p-0", showCountdown && "no-underline")}
              onClick={resendHandler}
              disabled={!email || showCountdown || isResending}
            >
              {isResending && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
              {showCountdown ? `Resend confirmation email in (${count}s)` : "Resend email"}
            </Button>
          </li>
        </ol>
      </div>
    </>
  )
}

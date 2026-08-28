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
      <MailCheckIcon className="mb-4 h-14 w-14" />
      <h1 className="m-0 text-[26px] font-extrabold leading-tight">Confira seu e-mail</h1>
      <p className="mb-6 mt-2 text-sm leading-relaxed text-muted-foreground">
        Para concluir o cadastro, abra o link de confirmação enviado para{" "}
        {email ? <strong className="text-primary">{email}</strong> : "seu e-mail"}. Depois da
        confirmação, você será redirecionado de volta ao JV Notes.
      </p>

      <ErrorBlock message={error} />

      <div className="mt-5 border-t border-border pt-5 text-sm">
        <p className="mb-2 font-medium">Não recebeu o e-mail?</p>
        <p className="mb-3 text-muted-foreground">
          Verifique as pastas de spam ou lixo eletrônico. Se necessário, envie novamente.
        </p>
        <Button
          variant="outline"
          className={cn("w-full", showCountdown && "no-underline")}
          onClick={resendHandler}
          disabled={!email || showCountdown || isResending}
        >
          {isResending && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
          {showCountdown ? `Reenviar em ${count}s` : "Reenviar e-mail de confirmação"}
        </Button>
      </div>
    </>
  )
}

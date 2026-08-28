"use client"

import { Button } from "@/components/ui/button"
import { MailCheckIcon } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function ForgotPasswordVerifyPage() {
  const params = useSearchParams()
  const email = params.get("mailto")

  return (
    <>
      <MailCheckIcon className="mb-3 h-20 w-20" />
      <h1 className="mb-8 text-3xl font-bold md:text-4xl">Confira seu e-mail</h1>
      <p className="mb-3 w-full text-left text-sm">
        Enviamos um link de redefinição de senha para <strong>{email}</strong>.
      </p>
      <p className="w-full text-left text-sm text-muted-foreground">
        Abra a mensagem e clique em <strong>Reset password</strong>. O link levará você de
        volta ao JV Notes para escolher uma nova senha.
      </p>

      <hr className="my-8 w-full" />

      <div className="flex w-full flex-col gap-3 text-sm">
        <p className="text-muted-foreground">
          Se a mensagem não aparecer, verifique as pastas de spam ou lixo eletrônico.
        </p>

        <Button variant="outline" className="w-full" asChild>
          <Link href="/forgot-password">Usar outro e-mail</Link>
        </Button>

        <Button variant="link" className="w-full" asChild>
          <Link href="/login">Voltar para entrar</Link>
        </Button>
      </div>
    </>
  )
}

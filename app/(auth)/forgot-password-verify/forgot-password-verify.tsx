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
      <MailCheckIcon className="mb-4 h-14 w-14" />
      <h1 className="m-0 text-[26px] font-extrabold leading-tight">Confira seu e-mail</h1>
      <p className="mb-3 mt-2 text-sm leading-relaxed text-muted-foreground">
        Enviamos um link de redefinição de senha para{" "}
        <strong className="text-primary">{email || "seu e-mail"}</strong>.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Abra a mensagem e clique no link de redefinição. Você voltará ao JV Notes para criar
        uma nova senha.
      </p>

      <div className="mt-5 border-t border-border pt-5">
        <p className="mb-4 text-sm text-muted-foreground">
          Se a mensagem não aparecer, verifique as pastas de spam ou lixo eletrônico.
        </p>

        <div className="grid gap-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/forgot-password">Usar outro e-mail</Link>
          </Button>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/login">Voltar para entrar</Link>
          </Button>
        </div>
      </div>
    </>
  )
}

"use client"

import ErrorBlock from "@/components/error-block"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoaderIcon } from "lucide-react"
import Link from "next/link"
import useForgotPassword from "./_hooks/use-forgot-password"

export default function ForgotPasswordPage() {
  const { errors, form, isLoadingSubmit, submitHandler } = useForgotPassword()

  return (
    <>
      <h1 className="m-0 text-[26px] font-extrabold leading-tight">Redefinir senha</h1>
      <p className="mb-6 mt-2 text-sm leading-relaxed text-muted-foreground">
        Informe o e-mail da sua conta. Enviaremos um link para você criar uma nova senha.
      </p>

      <Form {...form}>
        <form onSubmit={submitHandler} className="grid w-full gap-4" autoComplete="off">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-bold">E-mail</FormLabel>
                <FormControl>
                  <Input
                    placeholder="seu@email.com"
                    type="email"
                    autoComplete="email"
                    className="h-11 rounded-[10px] bg-background px-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ErrorBlock message={errors.root?.apiError.message} />

          <Button
            size="lg"
            className="h-11 w-full rounded-[10px] font-extrabold"
            type="submit"
            disabled={isLoadingSubmit}
          >
            {isLoadingSubmit && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
            {isLoadingSubmit ? "Enviando…" : "Enviar link de redefinição"}
          </Button>
        </form>
      </Form>

      <div className="mt-5 flex flex-col gap-2 text-center text-xs text-muted-foreground">
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Voltar para entrar
        </Link>
        <p>
          Ainda não possui uma conta?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Cadastrar
          </Link>
        </p>
      </div>
    </>
  )
}

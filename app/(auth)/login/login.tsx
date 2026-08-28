"use client"

import ErrorBlock from "@/components/error-block"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import InputPassword from "@/components/form/input-password"
import { LoaderIcon } from "lucide-react"
import Link from "next/link"
import { useLogin } from "./_hooks/use-login"

export default function LoginPage() {
  const { errors, form, isLoadingSubmit, submitHandler } = useLogin()

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-y-auto bg-background px-6 py-10 text-primary">
      <div className="w-full max-w-[420px]">
        <main className="w-full rounded-[18px] border border-border bg-background p-6 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center">
            <span className="text-lg font-bold tracking-tight">JV notes</span>
          </div>

          <h1 className="m-0 text-[26px] font-extrabold leading-tight">Entrar</h1>
          <p className="mb-6 mt-2 text-sm leading-relaxed text-muted-foreground">
            Acesse suas notas pessoais.
          </p>

          <Form {...form}>
            <form
              onSubmit={submitHandler}
              className="grid w-full gap-4"
              autoComplete="off"
            >
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

              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-bold">Senha</FormLabel>
                    <FormControl>
                      <InputPassword error={fieldState.error} field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="-mt-1 flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-[13px] text-muted-foreground transition-colors hover:text-primary"
                >
                  Esqueci minha senha
                </Link>
              </div>

              <ErrorBlock message={errors.root?.apiError.message} />

              <Button
                size="lg"
                className="h-11 w-full rounded-[10px] font-extrabold"
                type="submit"
                disabled={isLoadingSubmit}
              >
                {isLoadingSubmit && (
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isLoadingSubmit ? "Aguarde…" : "Entrar"}
              </Button>
            </form>
          </Form>

          <Link
            href="/signup"
            className="mt-4 block w-full py-2 text-center text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            Cadastrar
          </Link>
        </main>
      </div>

      <div className="pointer-events-none fixed bottom-3 left-4 right-4 text-center text-[11px] leading-relaxed text-muted-foreground/70">
        Site pessoal de notas online · Uso educacional
      </div>
    </div>
  )
}

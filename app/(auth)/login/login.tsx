"use client"

import ErrorBlock from "@/components/error-block"
import InputPassword from "@/components/form/input-password"
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
import { LoaderIcon } from "lucide-react"
import Link from "next/link"
import { useLogin } from "./_hooks/use-login"

export default function LoginPage() {
  const { errors, form, isLoadingSubmit, submitHandler } = useLogin()

  return (
    <>
      <h1 className="m-0 text-[26px] font-extrabold leading-tight">Entrar</h1>
      <p className="mb-6 mt-2 text-sm leading-relaxed text-muted-foreground">
        Acesse suas notas pessoais.
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
            {isLoadingSubmit && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
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
    </>
  )
}

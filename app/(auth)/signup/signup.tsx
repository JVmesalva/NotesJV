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
import { useSignUp } from "./_hooks/use-signup"

export default function SignUpPage() {
  const { errors, form, isLoadingSubmit, submitHandler } = useSignUp()

  return (
    <>
      <h1 className="m-0 text-[26px] font-extrabold leading-tight">Criar conta</h1>
      <p className="mb-6 mt-2 text-sm leading-relaxed text-muted-foreground">
        Cadastre seu e-mail e uma senha para começar a usar o JV Notes.
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
                <InputPassword.Validation password={field.value} />
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
            {isLoadingSubmit ? "Aguarde…" : "Cadastrar"}
          </Button>
        </form>
      </Form>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        Já possui uma conta?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </>
  )
}

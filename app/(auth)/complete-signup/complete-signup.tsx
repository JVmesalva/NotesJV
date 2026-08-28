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
import { LoaderIcon } from "lucide-react"
import { useCompleteProfile } from "./_hooks/use-complete-profile"

export default function CompleteSignUpPage() {
  const { errors, form, isLoadingSubmit, submitHandler } = useCompleteProfile()

  return (
    <>
      <h1 className="m-0 text-[26px] font-extrabold leading-tight">Complete seu perfil</h1>
      <p className="mb-6 mt-2 text-sm leading-relaxed text-muted-foreground">
        Informe como você deseja aparecer dentro do JV Notes. O nome de usuário é apenas do
        perfil e não substitui o login por e-mail.
      </p>

      <Form {...form}>
        <form onSubmit={submitHandler} className="grid w-full gap-4" autoComplete="off">
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-bold">Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Seu nome"
                    type="text"
                    autoComplete="name"
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
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-bold">Nome de usuário</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex.: joaovictor"
                    type="text"
                    autoComplete="username"
                    className="h-11 rounded-[10px] bg-background px-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ErrorBlock className="m-0" message={errors.root?.apiError.message} />

          <Button
            size="lg"
            className="h-11 w-full rounded-[10px] font-extrabold"
            type="submit"
            disabled={isLoadingSubmit}
          >
            {isLoadingSubmit && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
            {isLoadingSubmit ? "Salvando…" : "Concluir cadastro"}
          </Button>
        </form>
      </Form>
    </>
  )
}

"use client"

import SignOutDialog from "@/components/dialog/sign-out-dialog"
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
import { LoaderIcon, PartyPopperIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useResetPassword } from "./_hooks/use-reset-password"

export default function ResetPasswordPage() {
  const router = useRouter()
  const { errors, form, isDisableSubmit, isLoadingSubmit, isSuccess, submitHandler } =
    useResetPassword()

  if (isSuccess) {
    return (
      <>
        <PartyPopperIcon className="mb-4 h-14 w-14" />
        <h1 className="m-0 text-[26px] font-extrabold leading-tight">Senha alterada</h1>
        <p className="mb-6 mt-2 text-sm leading-relaxed text-muted-foreground">
          Sua nova senha foi salva com sucesso.
        </p>
        <div className="grid w-full gap-2">
          <Button variant="default" onClick={() => router.replace("/")}>
            Ir para minhas notas
          </Button>
          <SignOutDialog>
            <Button variant="ghost">Sair da conta</Button>
          </SignOutDialog>
        </div>
      </>
    )
  }

  return (
    <>
      <h1 className="m-0 text-[26px] font-extrabold leading-tight">Criar nova senha</h1>
      <p className="mb-6 mt-2 text-sm leading-relaxed text-muted-foreground">
        Defina uma nova senha para sua conta do JV Notes.
      </p>

      <Form {...form}>
        <form onSubmit={submitHandler} className="grid w-full gap-4" autoComplete="off">
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-bold">Nova senha</FormLabel>
                <FormControl>
                  <InputPassword
                    placeholder="Digite a nova senha..."
                    error={fieldState.error}
                    field={field}
                  />
                </FormControl>
                <FormMessage />
                <InputPassword.Validation prefix="Nova senha" password={field.value} />
              </FormItem>
            )}
          />

          <ErrorBlock className="m-0" message={errors.root?.apiError.message} />

          <Button
            size="lg"
            className="h-11 w-full rounded-[10px] font-extrabold"
            type="submit"
            disabled={isDisableSubmit}
          >
            {isLoadingSubmit && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
            {isLoadingSubmit ? "Salvando…" : "Salvar nova senha"}
          </Button>
        </form>
      </Form>
    </>
  )
}

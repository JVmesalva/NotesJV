"use client"

import SignOutDialog from "@/components/dialog/sign-out-dialog"
import ModeToggle from "@/components/mode-toogle"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/store/use-user-store"
import { ChevronRightIcon, EditIcon, Moon, Sun } from "lucide-react"
import { useEffectOnce } from "usehooks-ts"
import ChangeEmailDialog from "./_components/change-email-dialog/dialog"
import ChangePasswordDialog from "./_components/change-password-dialog"
import ChangeProfileDialog from "./_components/change-profile-dialog"

export default function SettingsPage() {
  const { currentUser, fullname, username, getCurrentProfileUserAsync } = useUserStore()

  useEffectOnce(() => {
    getCurrentProfileUserAsync()
  })

  return (
    <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-y-8 px-4 text-primary">
      <ChangeProfileDialog>
        <Button
          size="lg"
          className="flex h-auto w-full items-center justify-between px-0 hover:bg-background "
          variant="ghost"
        >
          <div className="flex items-center">
            <div className="relative mr-3 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-secondary-foreground">
              <span className="text-2xl font-medium uppercase text-secondary">
                {fullname ? fullname[0] : "S"}
              </span>
            </div>

            {fullname && username && (
              <div className="flex flex-col items-start ">
                <span className="mb-0 capitalize">{fullname}</span>
                <span className="block text-left text-xs font-normal text-muted-foreground">
                  @{username}
                </span>
              </div>
            )}
          </div>
          <EditIcon className="h-4 w-4" />
        </Button>
      </ChangeProfileDialog>

      <section>
        <h2 className="mb-2 border-b pb-2 text-xs font-medium ">Minhas configurações</h2>
        <ModeToggle>
          <Button
            size="lg"
            className="flex h-16 w-full items-center px-0 hover:bg-background "
            variant="ghost"
          >
            <div className="flex w-full flex-col items-start">
              <span className="mb-1 ">Aparência</span>

              <span className="block text-left text-xs font-normal text-muted-foreground">
                Personalize a aparência do Station nos seus dispositivos
              </span>
            </div>

            <span className="flex h-10 shrink-0 items-start justify-center rounded-md">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only ">Alterar tema</span>
            </span>
          </Button>
        </ModeToggle>
      </section>

      <section>
        <h2 className="mb-2 border-b pb-2 text-xs font-medium">Segurança da conta</h2>

        <ChangeEmailDialog>
          <Button
            size="lg"
            className="flex h-16 w-full flex-col items-start px-0 hover:bg-background "
            variant="ghost"
          >
            <div className="mb-1 flex w-full justify-between align-baseline">
              <span>E-mail</span>
              <EditIcon className="h-4 w-4" />
            </div>
            <span className="block text-left text-xs font-normal text-muted-foreground">
              {currentUser?.email}
            </span>
          </Button>
        </ChangeEmailDialog>

        <ChangePasswordDialog>
          <Button
            size="lg"
            className="flex h-16 w-full flex-col items-start px-0 hover:bg-background "
            variant="ghost"
          >
            <div className="mb-1 flex w-full justify-between align-baseline">
              <span>Senha</span>
              <EditIcon className="h-4 w-4" />
            </div>
            <span className="block text-left text-xs font-normal text-muted-foreground">
              Defina uma senha permanente para entrar na sua conta.
            </span>
          </Button>
        </ChangePasswordDialog>
      </section>

      <section>
        <h2 className="mb-2 border-b pb-2 text-xs font-medium">Suporte</h2>

        <SignOutDialog scope="others">
          <Button
            size="lg"
            className="flex h-16 w-full flex-col items-start px-0 hover:bg-background "
            variant="ghost"
          >
            <div className="mb-1 flex w-full justify-between align-baseline">
              <span>Sair dos outros dispositivos</span>
              <ChevronRightIcon className="h-4 w-4" />
            </div>
            <span className="block max-w-[80%] text-left text-xs font-normal text-muted-foreground">
              Encerre todas as outras sessões ativas, exceto esta
            </span>
          </Button>
        </SignOutDialog>

        <Button
          size="lg"
          className="flex h-16 w-full flex-col items-start px-0 hover:bg-background "
          variant="ghost"
        >
          <div className="mb-1 flex w-full justify-between align-baseline">
            <span className="text-destructive">Excluir minha conta</span>
            <ChevronRightIcon className="h-4 w-4" />
          </div>
          <span className="block text-left text-xs font-normal text-muted-foreground">
            Excluir permanentemente a conta
          </span>
        </Button>
      </section>
    </div>
  )
}

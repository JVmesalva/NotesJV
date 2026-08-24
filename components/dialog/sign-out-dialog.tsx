"use client"

import { useUserStore } from "@/store/use-user-store"
import { type SignOut } from "@supabase/supabase-js"
import { PropsWithChildren } from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog"

export default function SignOutDialog({
  children,
  scope = "local",
}: PropsWithChildren & SignOut) {
  const { signOutAsync } = useUserStore()
  const title = {
    local: "Tem certeza de que deseja sair?",
    global: "Tem certeza de que deseja sair de todos os dispositivos?",
    others: "Tem certeza de que deseja sair dos outros dispositivos?",
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="w-[90%] gap-0 rounded-xl p-0 md:max-w-sm" hideCloseButton>
        <DialogHeader className="p-4">
          <DialogDescription className="leading-1 text-left text-primary">
            {title[scope]}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full flex-row gap-0 border-t">
          <Button
            type="button"
            size="lg"
            variant="ghost"
            className="flex-1 rounded-none rounded-bl-xl text-destructive hover:text-destructive"
            onClick={() => signOutAsync(scope)}
          >
            Sim
          </Button>
          <div className="!m-0 box-border h-full w-[1px] border-r p-0" />
          <DialogClose asChild className="!m-0">
            <Button
              type="button"
              size="lg"
              className="flex-1 rounded-none rounded-br-xl "
              variant="ghost"
            >
              Não
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

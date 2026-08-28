import { cn } from "@/lib/utils"
import React, { useEffect, useState } from "react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { type FieldError } from "react-hook-form"
import { CheckIcon, DotIcon, InfoIcon } from "lucide-react"

type Props = {
  /** Comes from FormField render method */
  field: object
  placeholder?: string
  error?: FieldError
}

export default function InputPassword({ placeholder, error, field }: Props) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={cn("box-content flex h-11 overflow-clip rounded-md")}>
      <Input
        className={cn("peer rounded-r-none border-r-0", error && "border-destructive")}
        placeholder={showPassword ? placeholder || "Digite sua senha..." : "********"}
        type={showPassword ? "text" : "password"}
        {...field}
      />

      <Button
        type="button"
        variant="link"
        className={cn(
          "w-15 grid h-11 cursor-pointer items-center rounded-l-none border-y border-r border-accent bg-accent",
          "peer-focus-visible:border-input peer-focus-visible:bg-background",
          error && "border-destructive",
        )}
        onClick={() => setShowPassword(prev => !prev)}
      >
        {!showPassword ? <span>Mostrar</span> : <span>Ocultar</span>}
      </Button>
    </div>
  )
}

InputPassword.Validation = function PasswordValidation({
  prefix,
  password,
}: {
  prefix?: string
  password?: string
}) {
  const [matchPassword, setMatchPassword] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
  })

  const checkPassword = (password?: string) => {
    setMatchPassword({
      length: Boolean(password && password.length >= 8),
      uppercase: Boolean(password && password.match(/.*[A-Z].*/)),
      lowercase: Boolean(password && password.match(/.*[a-z].*/)),
      digit: Boolean(password && password.match(/.*\d.*/)),
    })
  }

  useEffect(() => {
    checkPassword(password)
  }, [password])

  return (
    <div className="rounded-md bg-sky-500/10 p-3 text-xs text-primary">
      <p className="mb-2 flex items-center gap-x-2 font-medium">
        <InfoIcon size={16} />
        <span>{`${prefix || "A senha"} deve conter pelo menos:`}</span>
      </p>

      <ul className="flex flex-col gap-1 text-primary/90">
        <li className="flex gap-x-3">
          <span className="w-3">
            {matchPassword.length ? <CheckIcon size={16} /> : <DotIcon size={16} />}
          </span>
          <span>8 caracteres</span>
        </li>
        <li className="flex gap-x-3">
          <span className="w-3">
            {matchPassword.lowercase ? <CheckIcon size={16} /> : <DotIcon size={16} />}
          </span>
          <span>1 letra minúscula</span>
        </li>
        <li className="flex gap-x-3">
          <span className="w-3">
            {matchPassword.uppercase ? <CheckIcon size={16} /> : <DotIcon size={16} />}
          </span>
          <span>1 letra maiúscula</span>
        </li>
        <li className="flex gap-x-3">
          <span className="w-3">
            {matchPassword.digit ? <CheckIcon size={16} /> : <DotIcon size={16} />}
          </span>
          <span>1 número (0-9)</span>
        </li>
      </ul>
    </div>
  )
}

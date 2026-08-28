import { PASSWORD_REGEX } from "@/constants/regex"
import { z } from "zod"

export const resetPasswordSchema = z.object({
  password: z
    .string({ required_error: "Informe a nova senha" })
    .min(8, { message: "A senha não atende aos requisitos" })
    .max(72, { message: "A senha deve ter no máximo 72 caracteres" })
    .regex(PASSWORD_REGEX, { message: "A senha não atende aos requisitos" }),
})

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>

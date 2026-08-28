import { PASSWORD_REGEX } from "@/constants/regex"
import { z } from "zod"

export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Informe seu e-mail" })
    .email({ message: "E-mail inválido" })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, { message: "A senha não atende aos requisitos" })
    .max(72, { message: "A senha deve ter no máximo 72 caracteres" })
    .regex(PASSWORD_REGEX, { message: "A senha não atende aos requisitos" }),
})

export type SignUpSchema = z.infer<typeof signUpSchema>

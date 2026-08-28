import { z } from "zod"

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Informe seu e-mail" })
    .email({ message: "E-mail inválido" })
    .toLowerCase()
    .trim(),
})

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>

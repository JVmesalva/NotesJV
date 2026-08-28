import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Informe seu e-mail" })
    .email({ message: "E-mail inválido" })
    .trim(),
  password: z.string().min(1, { message: "Informe sua senha" }),
})

export type LoginSchema = z.infer<typeof loginSchema>

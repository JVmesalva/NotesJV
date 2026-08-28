import { z } from "zod"

export const profileSchema = z.object({
  fullname: z
    .string()
    .min(4, { message: "O nome deve ter pelo menos 4 caracteres" })
    .max(65, { message: "O nome deve ter no máximo 65 caracteres" })
    .trim(),
  username: z
    .string()
    .min(4, { message: "O nome de usuário deve ter pelo menos 4 caracteres" })
    .max(65, { message: "O nome de usuário deve ter no máximo 65 caracteres" })
    .regex(/^[a-z0-9._]+$/, {
      message: "Use apenas letras minúsculas, números, ponto ou sublinhado",
    })
    .toLowerCase()
    .trim(),
})

export type ProfileSchema = z.infer<typeof profileSchema>

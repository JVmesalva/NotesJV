const translatedMessages: Record<string, string> = {
  "Invalid login credentials": "E-mail ou senha inválidos",
  "Invalid email or password": "E-mail ou senha inválidos",
  "Email already in use": "Este e-mail já está em uso",
  "User already registered": "Este e-mail já está cadastrado",
  "Email not confirmed": "Confirme seu e-mail antes de entrar",
}

export function getErrorMessage(error: Error) {
  if (!(error instanceof Error) || !error.message || typeof error.message !== "string") {
    return "Algo deu errado. Verifique sua conexão e tente novamente."
  }

  return translatedMessages[error.message] ?? error.message
}

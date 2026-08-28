import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JV notes",
    short_name: "JV notes",
    description: "Aplicativo pessoal de notas online.",
    start_url: "/",
    display: "standalone",
    background_color: "#27272a",
    theme_color: "#27272a",
    shortcuts: [
      {
        name: "Configurações",
        description: "Gerencie perfil, senha e preferências",
        url: "/settings",
      },
    ],
  }
}

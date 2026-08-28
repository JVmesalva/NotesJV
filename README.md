# JV notes

Aplicativo pessoal de notas online, disponível em `https://jvlc.cc`.

## Stack

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- EditorJS
- Supabase

## Autenticação

A V1 utiliza somente autenticação por e-mail e senha através do Supabase Auth. O projeto não utiliza login social/OAuth.

## Variáveis de ambiente

A configuração do aplicativo é lida preferencialmente por variáveis de ambiente. Na Vercel, configure as mesmas variáveis para Production e Preview:

```bash
NEXT_PUBLIC_APP_URL=https://jvlc.cc
NEXT_PUBLIC_SUPABASE_URL=https://<projeto>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<chave publica>
```

Para desenvolvimento local, copie `.env.example` para `.env.local` e preencha os valores do seu projeto.

## Desenvolvimento local

Instale as dependências e inicie o projeto:

```bash
pnpm install
pnpm dev
```

Verificações utilizadas antes de publicar alterações:

```bash
pnpm lint
pnpm test
pnpm build
```

## Origem e licença

O JV notes foi desenvolvido a partir do projeto open source Station / `station-a-notion-clone`, originalmente criado por Frialdhy S. Ketty e distribuído sob a licença MIT.

O aviso de copyright e os termos da licença original são preservados no arquivo `LICENSE`, conforme exigido pela licença MIT.

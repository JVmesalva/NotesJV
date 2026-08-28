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

## Desenvolvimento local

Crie um arquivo `.env.local` na raiz do projeto:

```bash
NEXT_PUBLIC_SUPABASE_URL=<sua url do Supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua chave publica do Supabase>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

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

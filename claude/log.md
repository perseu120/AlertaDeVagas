# Log de desenvolvimento — AlertaDeVagas Front-end

> Registro cronológico das decisões técnicas e do progresso de implementação.
> Cada entrada explica **o que** foi feito e **por que** essa abordagem foi escolhida.

---

## 2026-04-15 — Leitura da spec e diagnóstico inicial

### O que foi feito

Leitura completa do `spec.md` e análise do estado atual do repositório.

### Diagnóstico

| Arquivo | Problema |
|---|---|
| `src/app/_components/login-form.tsx` | `alert()` na linha 52, `console.log` nas linhas 45 e 49 |
| `src/app/signup/_components/signup-form.tsx` | Erros silenciosos: apenas `console.log`, sem feedback visual |
| `src/app/layout.tsx` | Metadata padrão do Next ("Create Next App"), `lang="en"` |
| `src/app/dashboard/page.tsx` | Validação de sessão na página, sem layout centralizado |
| Estrutura de pastas | Sem route groups `(public)` / `(authenticated)` |
| `.env.example` | Não existe |

### Fase definida para início

**Fase 0 — Fundação**, conforme Seção 11 da spec.

---

## 2026-04-15 — Decisão: Sonner como biblioteca de toast

### Decisão

Usar **Sonner** (`sonner`) em vez do toast nativo do shadcn/ui.

### Por que Sonner

- A própria spec recomenda Sonner como primeira opção (Seção 9 e Seção 11, item 1).
- O shadcn CLI adota Sonner como padrão desde 2024; o componente `sonner` do shadcn é apenas um wrapper sobre a lib.
- Sonner é mais simples de integrar com o App Router: basta adicionar `<Toaster />` no `layout.tsx` raiz e chamar `toast()` de qualquer Client Component sem precisar de contexto adicional.
- O toast nativo do shadcn exige um hook (`useToast`) e um componente `<Toaster>` com estado gerenciado, o que adiciona complexidade desnecessária.

### Como será integrado

1. Instalar `sonner`.
2. Adicionar `<Toaster />` no `src/app/layout.tsx`.
3. Criar `src/lib/toast.ts` como re-export tipado (opcional, para padronizar chamadas).
4. Substituir `alert()` e `console.log` nos formulários de auth pelas chamadas `toast.error()` / `toast.success()`.

---

*Próxima entrada: execução da Fase 0.*

---

## 2026-04-15 — Fase 0: Fundação (concluída)

### O que foi feito

#### 1. Sonner instalado e `<Toaster>` adicionado ao layout raiz

- `npm install sonner`
- `src/app/layout.tsx`: importado `<Toaster>` do Sonner com `richColors` e `position="top-right"`

**Por que essa abordagem:** O Sonner não precisa de contexto ou hook — basta um único `<Toaster>` no layout raiz e qualquer Client Component pode chamar `toast()` diretamente. Isso é mais simples e alinhado com o App Router do que o toast nativo do shadcn, que exige `useToast()` e estado global.

---

#### 2. Componentes shadcn adicionados via CLI

Componentes instalados: `card`, `dialog`, `select`, `skeleton`, `badge`, `switch`, `separator`.

**Por que via CLI:** O `shadcn` CLI garante que os componentes sejam gerados com as variáveis CSS e o estilo (`new-york`) já configurados em `components.json`. Criar manualmente geraria inconsistências com o tema existente.

---

#### 3. `error.tsx`, `not-found.tsx` e `loading.tsx` globais criados

- `src/app/error.tsx`: Client Component (obrigatório pelo Next.js para ter acesso ao `reset`). Exibe mensagem amigável em pt-BR e botão "Tentar novamente".
- `src/app/not-found.tsx`: Server Component. Exibe 404 com link de volta ao início.
- `src/app/loading.tsx`: Server Component. Skeleton genérico de colunas para o fallback global do Suspense.

**Por que skeleton genérico no loading global:** Cada rota terá seu próprio `loading.tsx` com skeleton específico (ex: cards de vagas). O loading global é apenas um fallback de segurança para rotas sem loading próprio — não precisa ser preciso, só precisa evitar tela em branco.

---

#### 4. Metadata e `lang` atualizados no layout raiz

- `lang="pt-BR"` (era `"en"`)
- `title`: template `"%s | AlertaDeVagas"` com default `"AlertaDeVagas"`
- `description`: copy em pt-BR

**Por que template de título:** Permite que cada página defina apenas seu próprio título (ex: `"Vagas"`) e o sufixo `" | AlertaDeVagas"` é adicionado automaticamente, sem repetição manual.

---

#### 5. `.env.example` criado

Variáveis conforme Seção 14 da spec: `DATABASE_URL`, `NEXT_PUBLIC_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.

---

#### 6. `src/generated/` adicionado ao `.gitignore`

**Por que:** A pasta `src/generated/` contém tipos gerados pelo Prisma em tempo de build. Commitá-los cria conflitos desnecessários e aumenta o diff de PRs sem agregar valor.

---

### Arquivos criados / alterados

| Arquivo | Ação |
|---|---|
| `src/app/layout.tsx` | Metadata, `lang="pt-BR"`, `<Toaster>` |
| `src/app/error.tsx` | Criado |
| `src/app/not-found.tsx` | Criado |
| `src/app/loading.tsx` | Criado |
| `src/components/ui/card.tsx` | Criado via shadcn CLI |
| `src/components/ui/dialog.tsx` | Criado via shadcn CLI |
| `src/components/ui/select.tsx` | Criado via shadcn CLI |
| `src/components/ui/skeleton.tsx` | Criado via shadcn CLI |
| `src/components/ui/badge.tsx` | Criado via shadcn CLI |
| `src/components/ui/switch.tsx` | Criado via shadcn CLI |
| `src/components/ui/separator.tsx` | Criado via shadcn CLI |
| `.env.example` | Criado |
| `.gitignore` | `src/generated/` adicionado |

---

*Próxima entrada: Fase 1 — Polimento da auth.*

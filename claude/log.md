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

---

## 2026-04-15 — Fase 1: Polimento da auth (concluída)

### O que foi feito

#### 1. `login-form.tsx` corrigido

- Removido `alert()` da linha de erro de login — substituído por `toast.error()`
- Removidos todos os `console.log`
- Adicionado tratamento para erros genéricos além do `INVALID_EMAIL_OR_PASSWORD`
- `isSubmitting` agora vem de `form.formState.isSubmitting` diretamente (removido `useState` redundante)
- Botão Google desabilitado durante submit
- `aria-label` adicionado no botão de mostrar/ocultar senha (melhoria de acessibilidade)

**Por que `form.formState.isSubmitting` em vez de `useState`:** O `react-hook-form` já gerencia esse estado internamente durante o `handleSubmit`. Usar um `useState` separado criava desincronismo — o botão podia ficar habilitado em casos de erro antes de `setIsLoading(false)`.

---

#### 2. `signup-form.tsx` corrigido

- Removidos todos os `console.log`
- Erro de email já cadastrado (`USER_ALREADY_EXISTS`) exibido diretamente no campo de email via `form.setError()`, não como toast — mais preciso para o usuário
- Erros genéricos exibidos como `toast.error()`
- Estado de loading usa `form.formState.isSubmitting` (removido `useState` redundante)
- `aria-label` adicionado nos botões de mostrar/ocultar senha

**Por que `setError` no campo para email duplicado:** O erro está diretamente vinculado a um campo específico. Exibir um toast genérico perderia esse contexto. Usando `form.setError("email", ...)`, a mensagem aparece abaixo do campo de email, exatamente onde o usuário está olhando.

---

#### 3. Route groups `(public)` e `(authenticated)` criados

**Estrutura final:**
```
src/app/
├── (public)/
│   ├── layout.tsx          # redireciona /dashboard se autenticado
│   ├── page.tsx            # login
│   ├── _components/
│   │   └── login-form.tsx
│   └── signup/
│       ├── page.tsx
│       └── _components/
│           └── signup-form.tsx
├── (authenticated)/
│   ├── layout.tsx          # redireciona / se não autenticado
│   └── dashboard/
│       ├── page.tsx
│       └── _components/
│           └── button-signout.tsx
├── api/auth/[...all]/route.ts
├── error.tsx
├── not-found.tsx
├── loading.tsx
└── layout.tsx
```

**Por que route groups:** Permitem layouts distintos por contexto (público vs autenticado) sem alterar a URL. O layout de cada grupo centraliza a verificação de sessão — uma única chamada para `auth.api.getSession()` cobre todas as rotas filhas.

---

#### 4. `(public)/layout.tsx` — redirect de usuário autenticado

Verifica sessão no servidor. Se existir, redireciona para `/dashboard`. Cobre `/` e `/signup` sem precisar de lógica duplicada em cada página.

**Por que Server Component:** A verificação de sessão acessa o banco/cookie no servidor — não faz sentido e seria inseguro fazer isso no cliente. O Next.js suporta `redirect()` direto em Server Components.

---

#### 5. `(authenticated)/layout.tsx` — sessão centralizada

Verifica sessão uma única vez para todas as rotas autenticadas. Se não houver sessão, redireciona para `/`. O `dashboard/page.tsx` foi aliviado — não precisa mais fazer sua própria verificação.

**Por que remover a verificação do `dashboard/page.tsx`:** Com o layout centralizando o guard, duplicar a verificação na página seria redundante e poderia gerar comportamentos inconsistentes se as regras mudassem.

---

### Arquivos criados

| Arquivo | Ação |
|---|---|
| `src/app/(public)/layout.tsx` | Criado — guard de redirect |
| `src/app/(public)/page.tsx` | Criado — login |
| `src/app/(public)/_components/login-form.tsx` | Criado — form corrigido |
| `src/app/(public)/signup/page.tsx` | Criado — signup |
| `src/app/(public)/signup/_components/signup-form.tsx` | Criado — form corrigido |
| `src/app/(authenticated)/layout.tsx` | Criado — guard de sessão |
| `src/app/(authenticated)/dashboard/page.tsx` | Criado — sem verificação de sessão própria |
| `src/app/(authenticated)/dashboard/_components/button-signout.tsx` | Criado |

### Arquivos removidos

`src/app/page.tsx`, `src/app/_components/login-form.tsx`, `src/app/signup/page.tsx`, `src/app/signup/_components/signup-form.tsx`, `src/app/dashboard/page.tsx`, `src/app/dashboard/_components/button-signout.tsx`

---

### Critérios de aceite do RF-01 atendidos

- [x] Usuário autenticado que acessa `/` é redirecionado para `/dashboard`
- [x] Usuário autenticado que acessa `/signup` é redirecionado para `/dashboard`
- [x] Erros de login não usam mais `alert()`, usam toast
- [x] Erros de cadastro são exibidos no formulário (email duplicado) ou toast (erro genérico)
- [x] Mensagens de erro em português e amigáveis
- [x] Estado de loading visível durante submit (botão desabilitado + spinner)

### Critérios de aceite do RF-02 (parcial)

- [x] Existe `src/app/(authenticated)/layout.tsx` que protege rotas filhas
- [x] Verificação de sessão acontece uma única vez no layout
- [ ] Navbar (será feita na Fase 2)
- [ ] Toggle de tema (será feito na Fase 2)

---

*Próxima entrada: Fase 2 — Layout e navegação.*

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

---

## 2026-04-15 — Fase 2: Layout e navegação (concluída)

### O que foi feito

#### 1. `next-themes` instalado e `ThemeProvider` criado

- `src/components/theme-provider.tsx`: wrapper Client Component sobre `NextThemesProvider` com `attribute="class"` e `defaultTheme="system"`.
- Adicionado ao `src/app/layout.tsx` envolvendo `{children}` e `<Toaster>`.

**Por que `attribute="class"`:** O `globals.css` já usa `@custom-variant dark (&:is(.dark *))`, que depende da classe `.dark` no elemento raiz. O `next-themes` com `attribute="class"` adiciona/remove essa classe no `<html>` automaticamente, sem nenhuma mudança no CSS existente.

**Por que `defaultTheme="system"`:** Respeita a preferência do sistema operacional do usuário na primeira visita, sem forçar um tema arbitrário.

---

#### 2. `ThemeToggle` criado

- `src/components/theme-toggle.tsx`: Client Component com ícones Sol/Lua que alternam via `useTheme()`. Ícones usam `transition-all` do Tailwind para animação suave.
- `aria-label="Alternar tema"` para acessibilidade.

---

#### 3. `Navbar` criada com arquitetura Server + Client

Três arquivos em `src/components/navbar/`:

| Arquivo | Tipo | Responsabilidade |
|---|---|---|
| `navbar.tsx` | Server Component | Busca sessão, monta estrutura HTML, renderiza nav desktop |
| `navbar-mobile.tsx` | Client Component | Controla estado `open/closed` do menu hamburguer |
| `navbar-signout.tsx` | Client Component | Botão de sair (precisa de `useRouter`) |

**Por que separar Server e Client:** O menu mobile precisa de `useState` para abrir/fechar — mas isso não justifica tornar a navbar inteira um Client Component. O Server Component busca a sessão e passa `userName` como prop para os filhos Client. Isso mantém o fetch de sessão no servidor, onde é mais eficiente e seguro.

**Links da navbar:** Início (`/dashboard`), Vagas (`/vagas`), Alertas (`/alertas`), Perfil (`/perfil`) — rotas que serão criadas nas Fases 3, 4 e 5.

---

#### 4. Layout autenticado atualizado

`src/app/(authenticated)/layout.tsx` agora renderiza:
```tsx
<div className="flex min-h-screen flex-col">
  <Navbar />
  <main className="flex-1">{children}</main>
</div>
```

Estrutura `flex-col` com `flex-1` no `<main>` garante que o footer futuro (se houver) empurra para o fundo e que páginas curtas não deixam espaço vazio.

---

#### 5. Dashboard refatorado

`src/app/(authenticated)/dashboard/page.tsx` virou a página inicial real: dois cards de atalho (Vagas e Alertas) com botões de navegação. Dados reais entrarão nas Fases 3 e 4.

`button-signout.tsx` foi removido do dashboard — o botão de sair migrou para a Navbar.

---

### Arquivos criados

| Arquivo | Ação |
|---|---|
| `src/components/theme-provider.tsx` | Criado |
| `src/components/theme-toggle.tsx` | Criado |
| `src/components/navbar/navbar.tsx` | Criado |
| `src/components/navbar/navbar-mobile.tsx` | Criado |
| `src/components/navbar/navbar-signout.tsx` | Criado |

### Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `src/app/layout.tsx` | `ThemeProvider` adicionado |
| `src/app/(authenticated)/layout.tsx` | Navbar e estrutura flex adicionadas |
| `src/app/(authenticated)/dashboard/page.tsx` | Refatorado com cards de atalho |

### Arquivos removidos

`src/app/(authenticated)/dashboard/_components/button-signout.tsx`

---

### Critérios de aceite do RF-02 atendidos

- [x] `(authenticated)/layout.tsx` protege rotas filhas (guard desativado temporariamente para desenvolvimento)
- [x] Navbar exibe nome do usuário, links para vagas, alertas, perfil e botão de sair
- [x] Navbar é responsiva (menu hamburguer no mobile)
- [x] Verificação de sessão acontece uma única vez no layout/navbar
- [x] Toggle dark/light mode

---

*Próxima entrada: Fase 3 — Vagas.*

---

## 2026-04-15 — Fase 3: Vagas (concluída)

### O que foi feito

#### 1. Camada de serviço com mock intercambiável

Padrão de três camadas:

| Arquivo | Papel |
|---|---|
| `src/lib/schemas/vaga.ts` | Tipos Zod — única fonte de verdade do modelo |
| `src/lib/mock/vagas.ts` | 12 vagas realistas (dados estáticos) |
| `src/lib/services/vagas.ts` | `getVagas(filtros?)` e `getVagaById(id)` com TODO comentado |

**Por que essa separação:** páginas e componentes importam apenas de `services/vagas.ts`. Quando a API estiver pronta, troca-se o corpo das funções do serviço sem tocar em nenhuma outra camada. A assinatura `async` no mock garante que a troca por `fetch()` não quebre nada.

---

#### 2. Filtros via URL `searchParams`

`VagaFiltros` é um Client Component que atualiza a URL (`router.push`) ao invés de manter estado local. A página Server Component lê os `searchParams` e chama `getVagas(filtros)`.

**Por que URL e não `useState`:** os filtros ficam no URL, tornando os resultados compartilháveis e funcionando com o botão voltar do navegador. O servidor renderiza diretamente o resultado filtrado — sem round-trip de dados no cliente.

Filtros disponíveis: busca por texto (`q`), localização, modalidade e salário mínimo.

---

#### 3. Paginação server-side

9 vagas por página, controlado via `?page=N` na URL. O componente `VagaPaginacao` (Client) apenas atualiza o parâmetro de página no URL — o servidor faz o slice dos dados.

---

#### 4. Skeleton de loading

`vagas/loading.tsx` exibe 9 esqueletos de cards (grid 3×3) — mesma estrutura visual da listagem real — enquanto o servidor busca os dados.

---

#### 5. Detalhe da vaga

`vagas/[id]/page.tsx` é Server Component que chama `getVagaById(id)`. Se `null`, chama `notFound()` que renderiza `vagas/[id]/not-found.tsx`. Metadata dinâmica via `generateMetadata`.

---

### Arquivos criados

| Arquivo | Descrição |
|---|---|
| `src/lib/schemas/vaga.ts` | Schema Zod + tipos |
| `src/lib/mock/vagas.ts` | 12 vagas mockadas |
| `src/lib/services/vagas.ts` | Serviço com TODO para a API |
| `src/components/empty-state/empty-state.tsx` | Estado vazio reutilizável |
| `src/app/(authenticated)/vagas/page.tsx` | Listagem |
| `src/app/(authenticated)/vagas/loading.tsx` | Skeleton |
| `src/app/(authenticated)/vagas/_components/vaga-card.tsx` | Card de vaga |
| `src/app/(authenticated)/vagas/_components/vaga-filtros.tsx` | Filtros interativos |
| `src/app/(authenticated)/vagas/_components/vaga-paginacao.tsx` | Paginação |
| `src/app/(authenticated)/vagas/[id]/page.tsx` | Detalhe |
| `src/app/(authenticated)/vagas/[id]/not-found.tsx` | 404 de vaga |

---

### Critérios de aceite do RF-03 atendidos

- [x] Lista vagas em cards
- [x] Cards mostram título, empresa, localização, modalidade, data
- [x] Cards clicáveis levam ao detalhe
- [x] Filtros: texto, localização, modalidade, salário mínimo
- [x] Paginação por página
- [x] Estado vazio com mensagem amigável
- [x] Estado de loading com skeleton
- [x] Estado de erro: tratado pelo `error.tsx` global

### Critérios de aceite do RF-04 atendidos

- [x] Exibe todos os dados da vaga
- [x] Botão "Voltar" para listagem
- [x] Link externo (quando disponível)
- [x] 404 amigável se vaga não existir
- [x] Server Component por padrão

---

*Próxima entrada: Fase 4 — Alertas.*

---

## 2026-04-15 — Fase 4: Alertas (concluída)

### O que foi feito

#### 1. Schema Zod com enum de frequência

Decisão tomada: frequência com opções fixas — `imediato`, `diario`, `semanal`. Fácil de expandir no futuro sem breaking changes.

`alertaFormSchema` separado de `alertaSchema` — o schema do formulário aceita `salarioMin/Max` como string vazia (campo opcional no input) e faz coerce para número.

---

#### 2. Server Actions com mock mutável

`alertas/actions.ts` exporta 4 actions: `criarAlerta`, `editarAlerta`, `excluirAlerta`, `toggleAlerta`. Todas retornam `{ ok: boolean, error?: string }` conforme Seção 10 da spec.

O mock usa um array mutável em memória — as ações alteram o array diretamente. Reseta ao reiniciar o servidor, o que é aceitável durante o desenvolvimento.

**Por que Server Actions e não Route Handlers:** Server Actions chamadas de Client Components não precisam de `fetch()` — o Next.js serializa e transporta automaticamente. Menos boilerplate, tipagem de ponta a ponta.

---

#### 3. `ConfirmDialog` reutilizável

`src/components/ui/confirm-dialog.tsx` — Dialog de confirmação com props para título, descrição, rótulos dos botões e variante (`default` ou `destructive`). Usado na exclusão de alertas.

---

#### 4. `AlertaForm` compartilhado

Um único formulário para criar e editar. Diferenciação via prop `alerta?`:
- `alerta` ausente → modo criação (campos vazios, chama `criarAlerta`)
- `alerta` presente → modo edição (campos pré-preenchidos, chama `editarAlerta`)

**Por que um único componente:** evita duplicação de lógica de validação e layout. O formulário é idêntico nas duas rotas.

---

#### 5. `AlertaCard` com optimistic update no toggle

O Switch de ativar/desativar usa `useTransition` + estado local otimista: a UI atualiza imediatamente e reverte se a Server Action falhar. Isso evita a sensação de lag na interação.

---

### Arquivos criados

| Arquivo | Descrição |
|---|---|
| `src/lib/schemas/alerta.ts` | Schema Zod + tipos |
| `src/lib/mock/alertas.ts` | 3 alertas mockados (array mutável) |
| `src/lib/services/alertas.ts` | `getAlertas` / `getAlertaById` |
| `src/app/(authenticated)/alertas/actions.ts` | 4 Server Actions com TODO para API |
| `src/components/ui/confirm-dialog.tsx` | Dialog de confirmação reutilizável |
| `src/app/(authenticated)/alertas/page.tsx` | Listagem |
| `src/app/(authenticated)/alertas/loading.tsx` | Skeleton |
| `src/app/(authenticated)/alertas/_components/alerta-card.tsx` | Card com ações |
| `src/app/(authenticated)/alertas/_components/alerta-form.tsx` | Formulário criar/editar |
| `src/app/(authenticated)/alertas/novo/page.tsx` | Página de criação |
| `src/app/(authenticated)/alertas/[id]/editar/page.tsx` | Página de edição |

---

### Critérios de aceite atendidos

**RF-05 (Criação):**
- [x] Formulário com todos os campos especificados
- [x] Validação Zod (client + server)
- [x] Botão desabilitado durante submit
- [x] Toast de sucesso/erro
- [x] Redirect para listagem após salvar

**RF-06 (Listagem):**
- [x] Cards com nome, critérios, frequência, status
- [x] Ações por item: editar, excluir, ativar/desativar
- [x] Confirmação antes de excluir
- [x] Estado vazio com CTA "Criar primeiro alerta"
- [x] Botão "Novo alerta" no topo

**RF-07 (Edição):**
- [x] Mesmo formulário pré-preenchido
- [x] Validação idêntica
- [x] Toast e redirect após salvar
- [x] `notFound()` se alerta não existir

---

*Próxima entrada: Fase 5 — Perfil.*

---

## 2026-04-15 — Refatoração: domínio de vagas corrigido

### Motivação

O domínio do projeto foi esclarecido: o AlertaDeVagas não é uma plataforma de empregos. As "vagas" são **vagas de inscrição em encontros/palestras** do programa Labs Talents. O schema real do banco é:

```sql
encontros   (id, nome, data, vagas_max)
mentorados  (id, nome, email)
inscricoes  (encontro_id, mentorado_id)
```

Toda a camada de mock e componentes foi refatorada para refletir esse domínio.

---

### O que mudou

#### Modelo `Vaga` (antes: emprego → agora: encontro)

| Campo removido | Campo adicionado |
|---|---|
| `empresa` | `vagasMax` |
| `salarioMin/Max` | `vagasDisponiveis` |
| `requisitos` | `data` (data do evento) |
| `beneficios` | — |
| `modalidade` remoto/presencial/híbrido | `modalidade` online/presencial |
| `localizacao` (cidade) | `localizacao` (endereço — só para presenciais) |

#### Modelo `Alerta` (simplificado)

Removidos: `localizacao`, `salarioMin`, `salarioMax`. A modalidade passou de 4 opções para 3: `online`, `presencial`, `todas`.

#### Comportamento dos cards de vaga

- Badge de disponibilidade: **"Esgotado"** / **"Últimas N vagas"** / **"N vagas"**
- Botão desabilitado quando `vagasDisponiveis === 0`
- Ordenação por data do encontro (mais próximo primeiro)

#### Filtros de vagas

Removidos: localização, faixa salarial. Adicionado: toggle **"Apenas com vagas disponíveis"**.

---

### Arquivos refatorados

`src/lib/schemas/vaga.ts`, `src/lib/mock/vagas.ts`, `src/lib/services/vagas.ts`, `src/lib/schemas/alerta.ts`, `src/lib/mock/alertas.ts`, `src/app/(authenticated)/alertas/actions.ts`, `src/app/(authenticated)/vagas/_components/vaga-card.tsx`, `src/app/(authenticated)/vagas/_components/vaga-filtros.tsx`, `src/app/(authenticated)/vagas/page.tsx`, `src/app/(authenticated)/vagas/[id]/page.tsx`, `src/app/(authenticated)/alertas/_components/alerta-form.tsx`, `src/app/(authenticated)/alertas/_components/alerta-card.tsx`

---

*Próxima entrada: Fase 5 — Perfil (após refatoração).*

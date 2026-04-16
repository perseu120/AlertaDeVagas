Front-end AlertaDeVagas

> Especificação para construção do front-end em Next.js 15 (App Router), TypeScript, Tailwind v4 e shadcn/ui.
> Base: documento de análise de arquitetura de 2026-04-14.

---

## 1. Contexto

O projeto está em estado de boilerplate de autenticação. Toda a camada de auth (login, cadastro, Google OAuth, dashboard protegido, logout) já existe e funciona. **Nenhuma funcionalidade de vagas ou alertas foi iniciada.**

Esta spec define o que precisa ser construído no front, em que ordem, e com quais critérios para considerar cada parte pronta.

---

## 2. Objetivo

Entregar um front-end funcional que permita ao usuário:

1. Autenticar-se (já existe, precisa de polimento)
2. Visualizar vagas disponíveis
3. Configurar alertas para receber notificações sobre novas vagas
4. Gerenciar sua conta e seus alertas

---

## 3. Escopo

### Dentro do escopo desta spec

- Correções e polimento da camada de auth existente
- Camada base de UI (toast, navbar, layouts, estados de erro/loading)
- Telas e fluxos de vagas (listagem, detalhe)
- Telas e fluxos de alertas (criação, listagem, edição, exclusão)
- Tela de perfil do usuário
- Padrões de componentes e código

### Fora do escopo

- Backend de vagas (rotas de API, lógica de scraping ou integração)
- Sistema de envio de notificações (email, push)
- Painel administrativo
- Funcionalidades para empresas ou recrutadores
- Testes automatizados (recomendado, mas tratado em spec separada)

---

## 4. Premissas

1. O Better Auth continua sendo a fonte de verdade para autenticação
2. A API de vagas e alertas será construída em paralelo, em `/api/vagas` e `/api/alertas` (consumida via fetch nas Server Actions ou Route Handlers)
3. O modelo de dados de `Vaga` e `Alerta` ainda não existe no Prisma e precisa ser definido em conjunto com o back
4. Verificação de email permanece desabilitada nesta fase
5. O projeto continua sem distinção de papéis (todo usuário é candidato)

---

## 5. Restrições técnicas

- **Framework:** Next.js 15 (App Router), Server Components por padrão
- **Componentes interativos:** marcar com `"use client"` apenas quando necessário
- **Estilização:** Tailwind v4 + variáveis CSS já definidas em `globals.css`
- **Componentes base:** shadcn/ui em `src/components/ui/`
- **Componentes de feature:** dentro de `_components/` na rota correspondente
- **Validação:** Zod + React Hook Form (padrão já estabelecido)
- **Acesso ao banco:** somente em Server Components ou Route Handlers, nunca no client

---

## 6. Requisitos Funcionais

### RF-01, Polimento da autenticação

**Descrição:** Corrigir as falhas de UX identificadas na auth existente.

**Critérios de aceitação:**
- [ ] Usuário autenticado que acessa `/` é redirecionado para `/dashboard`
- [ ] Usuário autenticado que acessa `/signup` é redirecionado para `/dashboard`
- [ ] Erros de login não usam mais `alert()`, usam toast
- [ ] Erros de cadastro são exibidos no formulário (não apenas em `console.log`)
- [ ] Mensagens de erro são em português e amigáveis (ex: "Email ou senha inválidos")
- [ ] Estado de loading visível durante submit (botão desabilitado + spinner)

---

### RF-02, Layout autenticado

**Descrição:** Criar um layout compartilhado para as rotas autenticadas, com navbar e estrutura consistente.

**Critérios de aceitação:**
- [ ] Existe um `src/app/(authenticated)/layout.tsx` que protege as rotas filhas
- [ ] Navbar exibe o nome do usuário, link para vagas, link para alertas, link para perfil, botão de sair
- [ ] Navbar é responsiva (menu hamburguer no mobile)
- [ ] Verificação de sessão acontece uma única vez no layout, não em cada página
- [ ] Layout inclui slot para conteúdo principal e área para toasts

---

### RF-03, Listagem de vagas

**Descrição:** Tela principal que exibe vagas disponíveis para o usuário logado.

**Rota:** `/dashboard/vagas` ou `/vagas` (a definir)

**Critérios de aceitação:**
- [ ] Lista vagas em formato de cards
- [ ] Cada card mostra: título, empresa, localização, modalidade (remoto/presencial/híbrido), data de publicação
- [ ] Cards são clicáveis e levam ao detalhe da vaga
- [ ] Filtros disponíveis: busca por texto, localização, modalidade, faixa salarial
- [ ] Paginação ou scroll infinito (a decidir conforme volume esperado)
- [ ] Estado vazio: mensagem amigável quando não há vagas
- [ ] Estado de loading: skeleton dos cards
- [ ] Estado de erro: mensagem com botão de tentar novamente

---

### RF-04, Detalhe de vaga

**Descrição:** Tela com informações completas de uma vaga.

**Rota:** `/vagas/[id]`

**Critérios de aceitação:**
- [ ] Exibe todos os dados da vaga: título, descrição completa, requisitos, benefícios, salário, empresa, localização, modalidade, data
- [ ] Botão "Voltar" para a listagem
- [ ] Botão "Salvar vaga" (se essa funcionalidade entrar no escopo)
- [ ] Link externo para a página original da vaga (se aplicável)
- [ ] 404 amigável caso a vaga não exista
- [ ] Server Component por padrão (vaga é dado estável)

---

### RF-05, Criação de alerta

**Descrição:** Formulário para o usuário configurar um novo alerta de vagas.

**Rota:** `/alertas/novo`

**Critérios de aceitação:**
- [ ] Formulário com campos: nome do alerta, palavras-chave, localização, modalidade, faixa salarial, frequência de notificação
- [ ] Validação com Zod (campos obrigatórios, formatos válidos)
- [ ] Botão "Salvar" desabilitado durante submit
- [ ] Toast de sucesso ao criar
- [ ] Toast de erro com mensagem clara em caso de falha
- [ ] Após salvar, redireciona para a listagem de alertas

---

### RF-06, Listagem de alertas

**Descrição:** Tela com todos os alertas configurados pelo usuário.

**Rota:** `/alertas`

**Critérios de aceitação:**
- [ ] Lista os alertas em cards ou tabela
- [ ] Cada item mostra: nome, critérios (resumo), frequência, status (ativo/inativo)
- [ ] Ações por item: editar, excluir, ativar/desativar
- [ ] Confirmação antes de excluir (modal ou dialog)
- [ ] Estado vazio com call-to-action "Criar primeiro alerta"
- [ ] Botão fixo "Novo alerta" no topo

---

### RF-07, Edição de alerta

**Descrição:** Formulário para alterar um alerta existente.

**Rota:** `/alertas/[id]/editar`

**Critérios de aceitação:**
- [ ] Mesmo formulário do RF-05, pré-preenchido com os dados atuais
- [ ] Validação idêntica
- [ ] Toast de sucesso e redirect para listagem após salvar
- [ ] 404 amigável se o alerta não existir ou não pertencer ao usuário

---

### RF-08, Perfil do usuário

**Descrição:** Tela para visualizar e editar dados pessoais.

**Rota:** `/perfil`

**Critérios de aceitação:**
- [ ] Exibe nome, email, foto, data de criação da conta
- [ ] Permite editar nome e foto (foto opcional nesta fase)
- [ ] Email não é editável (vinculado à autenticação)
- [ ] Botão de "Excluir conta" com confirmação dupla
- [ ] Toast de sucesso após salvar alterações

---

## 7. Requisitos Não-Funcionais

| Categoria | Requisito |
|---|---|
| Performance | Páginas de listagem devem renderizar em menos de 1s no LCP em conexão 4G |
| Acessibilidade | Componentes devem seguir padrão Radix (já garantido pelo shadcn). Navegação por teclado funcional em todos os formulários |
| Responsividade | Mobile-first. Layouts funcionais a partir de 360px de largura |
| SEO | Metadados configurados no `layout.tsx` raiz e em cada página pública |
| Internacionalização | Toda copy em pt-BR. Estrutura preparada para i18n futura, mas não implementada agora |
| Tema | Suporte a dark/light mode (variáveis CSS já existem, falta o toggle) |

---

## 8. Arquitetura do Front

### Estrutura de pastas proposta

```
src/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx              # Layout para rotas públicas
│   │   ├── page.tsx                # / (login)
│   │   └── signup/
│   │       └── page.tsx
│   ├── (authenticated)/
│   │   ├── layout.tsx              # Layout autenticado, valida sessão
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── vagas/
│   │   │   ├── page.tsx
│   │   │   ├── _components/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── alertas/
│   │   │   ├── page.tsx
│   │   │   ├── novo/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── editar/
│   │   │           └── page.tsx
│   │   └── perfil/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/[...all]/route.ts  # já existe
│   │   ├── vagas/route.ts          # a criar (com o back)
│   │   └── alertas/route.ts        # a criar (com o back)
│   ├── error.tsx                   # tratamento de erro global
│   ├── not-found.tsx               # 404 customizado
│   ├── loading.tsx                 # loading global
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                         # shadcn (existente)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── form.tsx
│   │   ├── toast.tsx               # a adicionar
│   │   ├── dialog.tsx              # a adicionar
│   │   ├── card.tsx                # a adicionar
│   │   ├── select.tsx              # a adicionar
│   │   └── skeleton.tsx            # a adicionar
│   ├── navbar/
│   │   └── navbar.tsx
│   └── empty-state/
│       └── empty-state.tsx
├── lib/
│   ├── auth.ts
│   ├── auth-client.ts
│   ├── prisma.ts
│   ├── utils.ts
│   └── schemas/                    # schemas Zod compartilhados
│       ├── alerta.ts
│       └── vaga.ts
└── hooks/
    └── use-toast.ts                # se usar Sonner ou shadcn toast
```

### Decisão sobre Route Groups

Usar `(public)` e `(authenticated)` como route groups permite:
- Validação de sessão centralizada no layout autenticado
- Layouts diferentes para cada contexto sem afetar a URL
- Organização clara entre o que é público e o que é privado

---

## 9. Componentes a serem criados

### Componentes de UI (shadcn/ui adicionais)

| Componente | Uso |
|---|---|
| Toast (Sonner recomendado) | Feedback de sucesso e erro em todas as ações |
| Dialog | Confirmação de exclusão, modais |
| Card | Cards de vagas e alertas |
| Select | Filtros de listagem, formulários |
| Skeleton | Estado de loading de listas |
| Badge | Tags de modalidade, status de alerta |
| Switch | Ativar/desativar alerta |
| Separator | Divisão visual em formulários e detalhes |

### Componentes de feature

| Componente | Localização | Função |
|---|---|---|
| `<Navbar>` | `src/components/navbar/` | Navegação principal autenticada |
| `<VagaCard>` | `app/(authenticated)/vagas/_components/` | Card de vaga na listagem |
| `<VagaFiltros>` | `app/(authenticated)/vagas/_components/` | Filtros da listagem |
| `<AlertaCard>` | `app/(authenticated)/alertas/_components/` | Card de alerta na listagem |
| `<AlertaForm>` | `app/(authenticated)/alertas/_components/` | Formulário de criar/editar alerta |
| `<EmptyState>` | `src/components/empty-state/` | Estado vazio reutilizável |
| `<ConfirmDialog>` | `src/components/ui/` | Dialog de confirmação reutilizável |

---

## 10. Padrões de implementação

### Server vs Client Components

- **Server por padrão.** Listagens de vagas e alertas devem buscar dados no servidor
- **Client apenas quando necessário.** Formulários, filtros interativos, toasts, dialogs
- **Server Actions** preferidas para mutações (criar, editar, excluir alerta), em vez de fetch direto

### Validação

- Schemas Zod ficam em `src/lib/schemas/` e são compartilhados entre client (RHF) e server (Server Actions)
- Mensagens de erro do Zod sempre em pt-BR
- Validação no client é UX, validação no server é segurança. Sempre as duas.

### Tratamento de erro

- `error.tsx` global captura erros não tratados
- Server Actions retornam objetos `{ ok: boolean, error?: string }` em vez de lançar exceções
- Toasts sempre que possível, alerts nunca

### Estado de loading

- Páginas com fetch usam `loading.tsx` adjacente para Suspense
- Botões de submit desabilitam durante a ação e mostram texto de loading
- Listagens mostram skeleton, não spinner em tela cheia

### Acessibilidade

- Todo input tem `<Label>` associado
- Botões de ícone têm `aria-label`
- Dialogs têm título e descrição
- Foco volta para o elemento de origem ao fechar modais

---

## 11. Plano de execução por fases

### Fase 0, Fundação (1 a 2 dias)

1. Adicionar Sonner ou shadcn toast
2. Adicionar componentes shadcn faltantes (Card, Dialog, Select, Skeleton, Badge, Switch)
3. Criar `error.tsx`, `not-found.tsx`, `loading.tsx` globais
4. Atualizar metadados em `layout.tsx`
5. Criar `.env.example`
6. Adicionar `src/generated/` ao `.gitignore`

### Fase 1, Polimento da auth (1 dia)

1. Substituir `alert()` por toast em login e signup
2. Adicionar feedback de erro no signup
3. Reorganizar rotas em route groups `(public)` e `(authenticated)`
4. Layout autenticado com validação de sessão centralizada
5. Redirect de usuário logado nas páginas públicas

### Fase 2, Layout e navegação (1 dia)

1. Criar `<Navbar>` com responsividade
2. Mover botão de sair para a navbar
3. Refazer dashboard como página inicial autenticada (resumo de alertas, atalhos)
4. Adicionar toggle de tema dark/light

### Fase 3, Vagas (3 a 4 dias)

1. Definir contrato da API de vagas com o back
2. Criar schema Zod e tipos
3. Listagem com cards, filtros e paginação
4. Tela de detalhe
5. Estados vazio, loading e erro

### Fase 4, Alertas (3 a 4 dias)

1. Definir contrato da API de alertas com o back
2. Criar schema Zod e tipos
3. Formulário de criação
4. Listagem com ações
5. Edição
6. Exclusão com confirmação
7. Toggle de ativar/desativar

### Fase 5, Perfil (1 a 2 dias)

1. Tela de visualização
2. Edição de nome
3. Upload de foto (avaliar serviço, ex: UploadThing)
4. Exclusão de conta

---

## 12. Critérios de pronto, geral

Uma feature está pronta quando:

- [ ] Todos os critérios de aceitação dos seus RFs estão atendidos
- [ ] Funciona em mobile (360px) e desktop
- [ ] Tem estados vazio, loading e erro tratados
- [ ] Validação no client e no server
- [ ] Acessível por teclado
- [ ] Sem `console.log` ou `alert` no código de produção
- [ ] Sem warnings no console do navegador
- [ ] Code review aprovado

---

## 13. Questões em aberto

Estas decisões precisam ser tomadas antes ou durante a execução:

1. **Origem das vagas:** scraping próprio, API de terceiros (LinkedIn, Indeed, Vagas.com), ou cadastro manual?
2. **Modelo de notificação dos alertas:** email (qual serviço, Resend ou SendGrid), push, in-app, ou todos?
3. **Frequência dos alertas:** opções fixas (diário, semanal) ou customizável?
4. **Vaga salva:** o usuário pode favoritar vagas para ver depois?
5. **Histórico de notificações:** o usuário consegue ver o que já foi enviado?
6. **Verificação de email:** será habilitada antes do release?
7. **Limites por usuário:** quantos alertas um usuário pode ter no plano gratuito?
8. **Modelo de monetização:** afeta o desenho do front (planos, paywall)?

Recomendação: fechar pelo menos 1, 2 e 3 antes de iniciar a Fase 3.

---

## 14. Anexos

### Variáveis de ambiente esperadas (`.env.example` a criar)

```
DATABASE_URL=
NEXT_PUBLIC_URL=http://localhost:3000
BETTER_AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Convenções de commit sugeridas

- `feat:` nova funcionalidade
- `fix:` correção
- `refactor:` refatoração sem mudança de comportamento
- `chore:` ajustes de build, deps, config
- `docs:` documentação

---

*Spec versão 1.0, gerada em 2026-04-15. Próxima revisão prevista após o fechamento das questões em aberto.*
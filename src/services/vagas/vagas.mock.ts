import type { Vaga, VagaFiltros } from "@/lib/schemas/vaga"
import type { VagaService } from "./types"

const POR_PAGINA = 9

const dados: Vaga[] = [
  {
    id: "1",
    nome: "Introdução ao React com Hooks",
    descricao:
      "Encontro prático para iniciantes em React. Vamos cobrir useState, useEffect e criação de componentes reutilizáveis. Traga seu notebook com Node.js instalado.",
    data: "2026-05-03T14:00:00.000Z",
    vagasMax: 20,
    vagasDisponiveis: 8,
    modalidade: "online",
    localizacao: null,
    urlInscricao: null,
    criadoEm: "2026-04-10T10:00:00.000Z",
  },
  {
    id: "2",
    nome: "Banco de Dados Relacional na Prática",
    descricao:
      "Palestra sobre modelagem de dados, normalização e consultas SQL avançadas com PostgreSQL. Exemplos reais de sistemas em produção.",
    data: "2026-05-07T19:00:00.000Z",
    vagasMax: 30,
    vagasDisponiveis: 0,
    modalidade: "presencial",
    localizacao: "Av. Paulista, 1000 — Sala 204, São Paulo, SP",
    urlInscricao: null,
    criadoEm: "2026-04-08T09:00:00.000Z",
  },
  {
    id: "3",
    nome: "Git e GitHub para Times",
    descricao:
      "Aprenda boas práticas de versionamento, fluxos de trabalho com branches, pull requests e code review em equipe.",
    data: "2026-05-10T10:00:00.000Z",
    vagasMax: 25,
    vagasDisponiveis: 25,
    modalidade: "online",
    localizacao: null,
    urlInscricao: null,
    criadoEm: "2026-04-09T11:00:00.000Z",
  },
  {
    id: "4",
    nome: "Node.js e APIs REST",
    descricao:
      "Construção de APIs REST com Node.js, Express e autenticação JWT. Do zero ao deploy em menos de 3 horas.",
    data: "2026-05-14T19:30:00.000Z",
    vagasMax: 20,
    vagasDisponiveis: 3,
    modalidade: "online",
    localizacao: null,
    urlInscricao: null,
    criadoEm: "2026-04-11T14:00:00.000Z",
  },
  {
    id: "5",
    nome: "Lógica de Programação com Python",
    descricao:
      "Encontro voltado para iniciantes absolutos. Aprenderemos variáveis, estruturas condicionais, loops e funções usando Python.",
    data: "2026-05-17T09:00:00.000Z",
    vagasMax: 40,
    vagasDisponiveis: 22,
    modalidade: "presencial",
    localizacao: "Rua dos Andradas, 300 — Auditório B, Porto Alegre, RS",
    urlInscricao: null,
    criadoEm: "2026-04-12T08:00:00.000Z",
  },
  {
    id: "6",
    nome: "Carreira em TI: Como Conseguir Seu Primeiro Emprego",
    descricao:
      "Painel com profissionais de RH e desenvolvedores sênior. Dicas de currículo, portfólio e como se preparar para entrevistas técnicas.",
    data: "2026-05-21T18:00:00.000Z",
    vagasMax: 50,
    vagasDisponiveis: 31,
    modalidade: "online",
    localizacao: null,
    urlInscricao: null,
    criadoEm: "2026-04-13T10:00:00.000Z",
  },
  {
    id: "7",
    nome: "TypeScript do Zero ao Avançado",
    descricao:
      "Workshop intensivo cobrindo tipagem estática, interfaces, generics e integração com React e Node.js.",
    data: "2026-05-24T09:00:00.000Z",
    vagasMax: 20,
    vagasDisponiveis: 0,
    modalidade: "presencial",
    localizacao: "Av. Beira Mar, 500 — Espaço Labs, Florianópolis, SC",
    urlInscricao: null,
    criadoEm: "2026-04-14T09:30:00.000Z",
  },
  {
    id: "8",
    nome: "Docker para Desenvolvedores",
    descricao:
      "Aprenda a containerizar suas aplicações, criar docker-compose para múltiplos serviços e preparar ambientes de desenvolvimento reproduzíveis.",
    data: "2026-05-28T19:00:00.000Z",
    vagasMax: 25,
    vagasDisponiveis: 18,
    modalidade: "online",
    localizacao: null,
    urlInscricao: null,
    criadoEm: "2026-04-14T15:00:00.000Z",
  },
  {
    id: "9",
    nome: "Design de Sistemas: Escalabilidade na Prática",
    descricao:
      "Como arquitetar sistemas que crescem. Caching, filas de mensagens, balanceamento de carga e bancos distribuídos discutidos com casos reais.",
    data: "2026-06-04T19:00:00.000Z",
    vagasMax: 30,
    vagasDisponiveis: 30,
    modalidade: "online",
    localizacao: null,
    urlInscricao: null,
    criadoEm: "2026-04-15T08:00:00.000Z",
  },
  {
    id: "10",
    nome: "CSS Moderno: Grid, Flexbox e Animações",
    descricao:
      "Dominando layout com CSS Grid e Flexbox, variáveis CSS, animações com keyframes e boas práticas de estilização em projetos reais.",
    data: "2026-06-07T10:00:00.000Z",
    vagasMax: 20,
    vagasDisponiveis: 14,
    modalidade: "presencial",
    localizacao: "Rua das Flores, 77 — Sala 3, Curitiba, PR",
    urlInscricao: null,
    criadoEm: "2026-04-15T09:00:00.000Z",
  },
]

export const vagaServiceMock: VagaService = {
  async getVagas(filtros?: Partial<VagaFiltros>) {
    let resultado = [...dados]

    if (filtros?.q) {
      const q = filtros.q.toLowerCase()
      resultado = resultado.filter(
        (v) =>
          v.nome.toLowerCase().includes(q) ||
          v.descricao.toLowerCase().includes(q)
      )
    }

    if (filtros?.modalidade) {
      resultado = resultado.filter((v) => v.modalidade === filtros.modalidade)
    }

    if (filtros?.apenasComVagas) {
      resultado = resultado.filter((v) => v.vagasDisponiveis > 0)
    }

    resultado.sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
    )

    const total = resultado.length
    const paginas = Math.ceil(total / POR_PAGINA)
    const page = filtros?.page ?? 1
    const inicio = (page - 1) * POR_PAGINA
    const vagas = resultado.slice(inicio, inicio + POR_PAGINA)

    return { vagas, total, paginas }
  },

  async getVagaById(id: string) {
    return dados.find((v) => v.id === id) ?? null
  },
}

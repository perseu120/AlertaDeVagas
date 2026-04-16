import type { Alerta, AlertaFormValues } from "@/lib/schemas/alerta"
import { alertaFormSchema } from "@/lib/schemas/alerta"
import type { AlertaService } from "./types"

function parsePalavras(raw: string): string[] {
  return raw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
}

const dados: Alerta[] = [
  {
    id: "1",
    nome: "Encontros de React",
    palavrasChave: ["React", "Hooks", "Front-end"],
    modalidade: "online",
    frequencia: "imediato",
    ativo: true,
    criadoEm: "2026-04-01T10:00:00.000Z",
  },
  {
    id: "2",
    nome: "Banco de Dados",
    palavrasChave: ["SQL", "PostgreSQL", "Banco de Dados"],
    modalidade: "todas",
    frequencia: "diario",
    ativo: true,
    criadoEm: "2026-04-05T09:00:00.000Z",
  },
  {
    id: "3",
    nome: "Presenciais em SP",
    palavrasChave: ["Python", "JavaScript", "Node.js"],
    modalidade: "presencial",
    frequencia: "semanal",
    ativo: false,
    criadoEm: "2026-04-10T14:00:00.000Z",
  },
]

export const alertaServiceMock: AlertaService = {
  async getAlertas() {
    return [...dados]
  },

  async getAlertaById(id: string) {
    return dados.find((a) => a.id === id) ?? null
  },

  async criarAlerta(values: AlertaFormValues) {
    const parsed = alertaFormSchema.safeParse(values)
    if (!parsed.success) {
      return { ok: false as const, error: "Dados inválidos. Verifique os campos e tente novamente." }
    }

    const { nome, palavrasChave, modalidade, frequencia } = parsed.data

    dados.push({
      id: String(Date.now()),
      nome,
      palavrasChave: parsePalavras(palavrasChave),
      modalidade,
      frequencia,
      ativo: true,
      criadoEm: new Date().toISOString(),
    })

    return { ok: true as const }
  },

  async editarAlerta(id: string, values: AlertaFormValues) {
    const parsed = alertaFormSchema.safeParse(values)
    if (!parsed.success) {
      return { ok: false as const, error: "Dados inválidos. Verifique os campos e tente novamente." }
    }

    const idx = dados.findIndex((a) => a.id === id)
    if (idx === -1) return { ok: false as const, error: "Alerta não encontrado." }

    const { nome, palavrasChave, modalidade, frequencia } = parsed.data

    dados[idx] = {
      ...dados[idx],
      nome,
      palavrasChave: parsePalavras(palavrasChave),
      modalidade,
      frequencia,
    }

    return { ok: true as const }
  },

  async excluirAlerta(id: string) {
    const idx = dados.findIndex((a) => a.id === id)
    if (idx === -1) return { ok: false as const, error: "Alerta não encontrado." }

    dados.splice(idx, 1)
    return { ok: true as const }
  },

  async toggleAlerta(id: string) {
    const alerta = dados.find((a) => a.id === id)
    if (!alerta) return { ok: false as const, error: "Alerta não encontrado." }

    alerta.ativo = !alerta.ativo
    return { ok: true as const }
  },
}

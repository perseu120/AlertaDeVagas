import type { Alerta } from "@/lib/schemas/alerta"

// Array mutável em memória — reseta ao reiniciar o servidor de dev.
export const alertasMock: Alerta[] = [
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

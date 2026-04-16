import type { Vaga, VagaFiltros } from "@/lib/schemas/vaga"
import { vagasMock } from "@/lib/mock/vagas"

const POR_PAGINA = 9

// ---------------------------------------------------------------------------
// TODO: quando a API estiver pronta, substitua o corpo de cada função abaixo
// por uma chamada fetch ao endpoint correspondente, mantendo a mesma assinatura.
//
// Exemplo:
//   export async function getVagas(filtros?: Partial<VagaFiltros>) {
//     const params = new URLSearchParams({ ...filtros })
//     const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/vagas?${params}`)
//     if (!res.ok) throw new Error("Falha ao buscar encontros")
//     return res.json() as Promise<{ vagas: Vaga[]; total: number; paginas: number }>
//   }
// ---------------------------------------------------------------------------

export async function getVagas(
  filtros?: Partial<VagaFiltros>
): Promise<{ vagas: Vaga[]; total: number; paginas: number }> {
  let resultado = [...vagasMock]

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

  // Ordena por data do encontro (mais próximo primeiro)
  resultado.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())

  const total = resultado.length
  const paginas = Math.ceil(total / POR_PAGINA)
  const page = filtros?.page ?? 1
  const inicio = (page - 1) * POR_PAGINA
  const vagas = resultado.slice(inicio, inicio + POR_PAGINA)

  return { vagas, total, paginas }
}

export async function getVagaById(id: string): Promise<Vaga | null> {
  // TODO: substituir por fetch(`${process.env.NEXT_PUBLIC_URL}/api/vagas/${id}`)
  return vagasMock.find((v) => v.id === id) ?? null
}

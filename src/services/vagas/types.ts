import type { Vaga, VagaFiltros } from "@/lib/schemas/vaga"

export interface VagaService {
  getVagas(
    filtros?: Partial<VagaFiltros>
  ): Promise<{ vagas: Vaga[]; total: number; paginas: number }>
  getVagaById(id: string): Promise<Vaga | null>
}

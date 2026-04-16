import { Suspense } from "react"
import { vagaFiltrosSchema } from "@/lib/schemas/vaga"
import { vagaService } from "@/services/vagas"
import { VagaCard } from "./_components/vaga-card"
import { VagaFiltros } from "./_components/vaga-filtros"
import { VagaPaginacao } from "./_components/vaga-paginacao"
import { EmptyState } from "@/components/empty-state/empty-state"

export const metadata = { title: "Encontros" }

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function VagasPage({ searchParams }: PageProps) {
  const params = await searchParams
  const filtros = vagaFiltrosSchema.parse({
    q: params.q,
    modalidade: params.modalidade,
    apenasComVagas: params.apenasComVagas,
    page: params.page,
  })

  const { vagas, total, paginas } = await vagaService.getVagas(filtros)

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Encontros</h1>
        <p className="mt-1 text-muted-foreground">
          {total === 0
            ? "Nenhum encontro encontrado"
            : `${total} encontro${total !== 1 ? "s" : ""} disponível${total !== 1 ? "s" : ""}`}
        </p>
      </div>

      <div className="mb-6">
        <Suspense>
          <VagaFiltros />
        </Suspense>
      </div>

      {vagas.length === 0 ? (
        <EmptyState
          titulo="Nenhum encontro encontrado"
          descricao="Tente ajustar os filtros ou volte mais tarde para novas oportunidades."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vagas.map((vaga) => (
              <VagaCard key={vaga.id} vaga={vaga} />
            ))}
          </div>

          <Suspense>
            <VagaPaginacao paginaAtual={filtros.page} totalPaginas={paginas} />
          </Suspense>
        </>
      )}
    </div>
  )
}

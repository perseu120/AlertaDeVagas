import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, ExternalLink, MapPin, Monitor, Users } from "lucide-react"
import { vagaService } from "@/services/vagas"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function statusVagas(disponiveis: number, max: number) {
  if (disponiveis === 0) return { label: "Esgotado", variant: "destructive" as const }
  if (disponiveis <= max * 0.2) return { label: `Últimas ${disponiveis} vagas`, variant: "default" as const }
  return { label: `${disponiveis} vagas disponíveis`, variant: "secondary" as const }
}

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const vaga = await vagaService.getVagaById(id)
  if (!vaga) return { title: "Encontro não encontrado" }
  return { title: vaga.nome }
}

export default async function VagaDetalhe({ params }: PageProps) {
  const { id } = await params
  const vaga = await vagaService.getVagaById(id)

  if (!vaga) notFound()

  const status = statusVagas(vaga.vagasDisponiveis, vaga.vagasMax)
  const esgotado = vaga.vagasDisponiveis === 0

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 gap-1">
        <Link href="/vagas">
          <ArrowLeft className="h-4 w-4" />
          Voltar para encontros
        </Link>
      </Button>

      {/* Cabeçalho */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-bold leading-tight">{vaga.nome}</h1>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatarData(vaga.data)}
          </span>

          {vaga.modalidade === "online" ? (
            <span className="flex items-center gap-1.5">
              <Monitor className="h-4 w-4" />
              Online
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {vaga.localizacao}
            </span>
          )}

          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {vaga.vagasDisponiveis} de {vaga.vagasMax} vagas
          </span>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Descrição */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Sobre o encontro</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{vaga.descricao}</p>
      </section>

      <Separator className="my-6" />

      {/* CTA */}
      <div className="flex flex-wrap gap-3">
        {vaga.urlInscricao ? (
          <Button asChild disabled={esgotado} className="gap-2">
            <a href={vaga.urlInscricao} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              {esgotado ? "Inscrições encerradas" : "Fazer inscrição"}
            </a>
          </Button>
        ) : (
          <Button disabled className="gap-2">
            {esgotado ? "Inscrições encerradas" : "Em breve"}
          </Button>
        )}
      </div>
    </div>
  )
}

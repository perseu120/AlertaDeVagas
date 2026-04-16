import Link from "next/link"
import { Calendar, MapPin, Monitor, Users } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Vaga } from "@/lib/schemas/vaga"

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function statusVagas(disponiveis: number, max: number) {
  if (disponiveis === 0) return { label: "Esgotado", variant: "destructive" as const }
  if (disponiveis <= max * 0.2) return { label: `${disponiveis} vagas`, variant: "default" as const }
  return { label: `${disponiveis} vagas`, variant: "secondary" as const }
}

interface VagaCardProps {
  vaga: Vaga
}

export function VagaCard({ vaga }: VagaCardProps) {
  const status = statusVagas(vaga.vagasDisponiveis, vaga.vagasMax)

  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{vaga.nome}</CardTitle>
          <Badge variant={status.variant} className="shrink-0">
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-2 pb-3">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span>{formatarData(vaga.data)}</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {vaga.modalidade === "online" ? (
            <>
              <Monitor className="h-3.5 w-3.5 shrink-0" />
              <span>Online</span>
            </>
          ) : (
            <>
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">{vaga.localizacao}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-3.5 w-3.5 shrink-0" />
          <span>
            {vaga.vagasDisponiveis} de {vaga.vagasMax} vagas disponíveis
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          asChild
          size="sm"
          className="w-full"
          variant={vaga.vagasDisponiveis === 0 ? "outline" : "default"}
          disabled={vaga.vagasDisponiveis === 0}
        >
          <Link href={`/vagas/${vaga.id}`}>
            {vaga.vagasDisponiveis === 0 ? "Esgotado" : "Ver detalhes"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

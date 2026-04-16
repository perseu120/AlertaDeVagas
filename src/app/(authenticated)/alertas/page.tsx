import Link from "next/link"
import { Plus } from "lucide-react"
import { alertaService } from "@/services/alertas"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state/empty-state"
import { AlertaCard } from "./_components/alerta-card"

export const metadata = { title: "Alertas" }

export default async function AlertasPage() {
  const alertas = await alertaService.getAlertas()

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alertas</h1>
          <p className="mt-1 text-muted-foreground">
            {alertas.length === 0
              ? "Nenhum alerta configurado"
              : `${alertas.length} alerta${alertas.length !== 1 ? "s" : ""} configurado${alertas.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/alertas/novo">
            <Plus className="h-4 w-4" />
            Novo alerta
          </Link>
        </Button>
      </div>

      {alertas.length === 0 ? (
        <EmptyState
          titulo="Nenhum alerta ainda"
          descricao="Crie seu primeiro alerta para receber notificações sobre vagas que combinam com você."
          rotulo="Criar primeiro alerta"
          href="/alertas/novo"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {alertas.map((alerta) => (
            <AlertaCard key={alerta.id} alerta={alerta} />
          ))}
        </div>
      )}
    </div>
  )
}

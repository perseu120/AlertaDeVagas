import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { alertaService } from "@/services/alertas"
import { Button } from "@/components/ui/button"
import { AlertaForm } from "../../_components/alerta-form"

export const metadata = { title: "Editar alerta" }

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditarAlertaPage({ params }: PageProps) {
  const { id } = await params
  const alerta = await alertaService.getAlertaById(id)

  if (!alerta) notFound()

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 gap-1">
        <Link href="/alertas">
          <ArrowLeft className="h-4 w-4" />
          Voltar para alertas
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Editar alerta</h1>
        <p className="mt-1 text-muted-foreground">
          Atualize os critérios do alerta <strong>{alerta.nome}</strong>.
        </p>
      </div>

      <AlertaForm alerta={alerta} />
    </div>
  )
}

"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

import type { Alerta } from "@/lib/schemas/alerta"
import { excluirAlerta, toggleAlerta } from "../actions"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

const frequenciaLabel: Record<Alerta["frequencia"], string> = {
  imediato: "Imediato",
  diario: "Diário",
  semanal: "Semanal",
}

const modalidadeLabel: Record<Alerta["modalidade"], string> = {
  online: "Online",
  presencial: "Presencial",
  todas: "Todas as modalidades",
}

interface AlertaCardProps {
  alerta: Alerta
}

export function AlertaCard({ alerta }: AlertaCardProps) {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [ativo, setAtivo] = useState(alerta.ativo)

  function handleToggle() {
    setAtivo((prev) => !prev)
    startTransition(async () => {
      const result = await toggleAlerta(alerta.id)
      if (!result.ok) {
        setAtivo((prev) => !prev)
        toast.error(result.error)
      }
    })
  }

  function handleExcluir() {
    startTransition(async () => {
      const result = await excluirAlerta(alerta.id)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success("Alerta excluído.")
      setConfirmOpen(false)
      router.refresh()
    })
  }

  return (
    <>
      <Card className={ativo ? "" : "opacity-60"}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base">{alerta.nome}</CardTitle>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground">
                {ativo ? "Ativo" : "Inativo"}
              </span>
              <Switch
                checked={ativo}
                onCheckedChange={handleToggle}
                disabled={isPending}
                aria-label={ativo ? "Desativar alerta" : "Ativar alerta"}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 pb-3">
          <div className="flex flex-wrap gap-1">
            {alerta.palavrasChave.map((p) => (
              <Badge key={p} variant="secondary" className="text-xs">
                {p}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>{modalidadeLabel[alerta.modalidade]}</span>
            <span>Notificação: {frequenciaLabel[alerta.frequencia]}</span>
          </div>
        </CardContent>

        <CardFooter className="gap-2 pt-0">
          <Button asChild size="sm" variant="outline" className="gap-1">
            <Link href={`/alertas/${alerta.id}/editar`}>
              <Pencil className="h-3.5 w-3.5" />
              Editar
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="gap-1 text-destructive hover:text-destructive"
            onClick={() => setConfirmOpen(true)}
            disabled={isPending}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Excluir
          </Button>
        </CardFooter>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        titulo="Excluir alerta"
        descricao={`Tem certeza que deseja excluir o alerta "${alerta.nome}"? Esta ação não pode ser desfeita.`}
        rotuloConfirmar="Excluir"
        loading={isPending}
        onConfirmar={handleExcluir}
      />
    </>
  )
}

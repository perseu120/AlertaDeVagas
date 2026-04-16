"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  titulo: string
  descricao: string
  rotuloCancelar?: string
  rotuloConfirmar?: string
  variante?: "default" | "destructive"
  loading?: boolean
  onConfirmar: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  titulo,
  descricao,
  rotuloCancelar = "Cancelar",
  rotuloConfirmar = "Confirmar",
  variante = "destructive",
  loading = false,
  onConfirmar,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription>{descricao}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {rotuloCancelar}
          </Button>
          <Button variant={variante} onClick={onConfirmar} disabled={loading}>
            {loading ? "Aguarde..." : rotuloConfirmar}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

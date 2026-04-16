"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { excluirConta } from "../actions"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export function PerfilDeleteAccount() {
  const router = useRouter()
  const [showFirstDialog, setShowFirstDialog] = useState(false)
  const [showSecondDialog, setShowSecondDialog] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [loading, setLoading] = useState(false)

  function handleFirstConfirm() {
    setShowFirstDialog(false)
    setConfirmText("")
    setShowSecondDialog(true)
  }

  async function handleDelete() {
    if (confirmText !== "EXCLUIR") return

    setLoading(true)
    const result = await excluirConta()
    setLoading(false)

    if (result.ok) {
      toast.success("Conta excluída com sucesso.")
      router.push("/")
    } else {
      setShowSecondDialog(false)
      toast.error(result.error)
    }
  }

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setShowFirstDialog(true)}
      >
        Excluir minha conta
      </Button>

      {/* Etapa 1: confirmação inicial */}
      <ConfirmDialog
        open={showFirstDialog}
        onOpenChange={setShowFirstDialog}
        titulo="Excluir conta"
        descricao="Essa ação é irreversível. Todos os seus dados, alertas e configurações serão permanentemente removidos."
        rotuloConfirmar="Continuar"
        variante="destructive"
        onConfirmar={handleFirstConfirm}
      />

      {/* Etapa 2: digitar "EXCLUIR" */}
      <Dialog open={showSecondDialog} onOpenChange={(open) => {
        if (!loading) {
          setShowSecondDialog(open)
          if (!open) setConfirmText("")
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão definitiva</DialogTitle>
            <DialogDescription>
              Para confirmar, digite <strong>EXCLUIR</strong> no campo abaixo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="confirm-delete">Confirmação</Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Digite EXCLUIR"
              disabled={loading}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowSecondDialog(false)
                setConfirmText("")
              }}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={confirmText !== "EXCLUIR" || loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

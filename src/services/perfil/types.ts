import type { ActionResult } from "@/services/types"

export interface PerfilService {
  atualizarNome(nome: string): Promise<ActionResult>
  excluirConta(): Promise<ActionResult>
}

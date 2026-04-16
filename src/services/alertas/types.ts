import type { Alerta, AlertaFormValues } from "@/lib/schemas/alerta"
import type { ActionResult } from "@/services/types"

export interface AlertaService {
  getAlertas(): Promise<Alerta[]>
  getAlertaById(id: string): Promise<Alerta | null>
  criarAlerta(values: AlertaFormValues): Promise<ActionResult>
  editarAlerta(id: string, values: AlertaFormValues): Promise<ActionResult>
  excluirAlerta(id: string): Promise<ActionResult>
  toggleAlerta(id: string): Promise<ActionResult>
}

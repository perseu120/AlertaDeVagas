"use server"

import { revalidatePath } from "next/cache"
import { alertaFormSchema, type AlertaFormValues } from "@/lib/schemas/alerta"
import { alertaService } from "@/services/alertas"

type ActionResult = { ok: true } | { ok: false; error: string }

export async function criarAlerta(values: AlertaFormValues): Promise<ActionResult> {
  const parsed = alertaFormSchema.safeParse(values)
  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos. Verifique os campos e tente novamente." }
  }

  const result = await alertaService.criarAlerta(parsed.data)
  if (result.ok) revalidatePath("/alertas")
  return result
}

export async function editarAlerta(
  id: string,
  values: AlertaFormValues
): Promise<ActionResult> {
  const parsed = alertaFormSchema.safeParse(values)
  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos. Verifique os campos e tente novamente." }
  }

  const result = await alertaService.editarAlerta(id, parsed.data)
  if (result.ok) revalidatePath("/alertas")
  return result
}

export async function excluirAlerta(id: string): Promise<ActionResult> {
  const result = await alertaService.excluirAlerta(id)
  if (result.ok) revalidatePath("/alertas")
  return result
}

export async function toggleAlerta(id: string): Promise<ActionResult> {
  const result = await alertaService.toggleAlerta(id)
  if (result.ok) revalidatePath("/alertas")
  return result
}

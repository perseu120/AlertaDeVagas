"use server"

import { revalidatePath } from "next/cache"
import { alertaFormSchema, type AlertaFormValues } from "@/lib/schemas/alerta"
import { alertasMock } from "@/lib/mock/alertas"

type ActionResult = { ok: true } | { ok: false; error: string }

// ---------------------------------------------------------------------------
// TODO: quando a API estiver pronta, substitua o corpo de cada action abaixo
// por uma chamada fetch ao endpoint correspondente, mantendo a mesma assinatura.
// ---------------------------------------------------------------------------

function parsePalavras(raw: string): string[] {
  return raw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
}

export async function criarAlerta(values: AlertaFormValues): Promise<ActionResult> {
  const parsed = alertaFormSchema.safeParse(values)
  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos. Verifique os campos e tente novamente." }
  }

  const { nome, palavrasChave, modalidade, frequencia } = parsed.data

  alertasMock.push({
    id: String(Date.now()),
    nome,
    palavrasChave: parsePalavras(palavrasChave),
    modalidade,
    frequencia,
    ativo: true,
    criadoEm: new Date().toISOString(),
  })

  revalidatePath("/alertas")
  return { ok: true }
}

export async function editarAlerta(
  id: string,
  values: AlertaFormValues
): Promise<ActionResult> {
  const parsed = alertaFormSchema.safeParse(values)
  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos. Verifique os campos e tente novamente." }
  }

  const idx = alertasMock.findIndex((a) => a.id === id)
  if (idx === -1) return { ok: false, error: "Alerta não encontrado." }

  const { nome, palavrasChave, modalidade, frequencia } = parsed.data

  alertasMock[idx] = {
    ...alertasMock[idx],
    nome,
    palavrasChave: parsePalavras(palavrasChave),
    modalidade,
    frequencia,
  }

  revalidatePath("/alertas")
  return { ok: true }
}

export async function excluirAlerta(id: string): Promise<ActionResult> {
  const idx = alertasMock.findIndex((a) => a.id === id)
  if (idx === -1) return { ok: false, error: "Alerta não encontrado." }

  alertasMock.splice(idx, 1)
  revalidatePath("/alertas")
  return { ok: true }
}

export async function toggleAlerta(id: string): Promise<ActionResult> {
  const alerta = alertasMock.find((a) => a.id === id)
  if (!alerta) return { ok: false, error: "Alerta não encontrado." }

  alerta.ativo = !alerta.ativo
  revalidatePath("/alertas")
  return { ok: true }
}

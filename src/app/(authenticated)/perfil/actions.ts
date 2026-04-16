"use server"

import { z } from "zod"

type ActionResult = { ok: true } | { ok: false; error: string }

// ---------------------------------------------------------------------------
// TODO: quando a integração com Better Auth estiver pronta, substitua o corpo
// de cada action por chamadas a auth.api.updateUser / auth.api.deleteUser,
// mantendo a mesma assinatura de retorno.
// ---------------------------------------------------------------------------

const nomeSchema = z
  .string()
  .min(2, "O nome deve ter pelo menos 2 caracteres.")
  .max(100, "O nome deve ter no máximo 100 caracteres.")

export async function atualizarNome(nome: string): Promise<ActionResult> {
  const parsed = nomeSchema.safeParse(nome)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0].message }
  }

  // Mock: simula latência de rede
  await new Promise((r) => setTimeout(r, 500))

  // TODO: substituir por auth.api.updateUser({ body: { name: parsed.data } })
  return { ok: true }
}

export async function excluirConta(): Promise<ActionResult> {
  // Mock: simula latência de rede
  await new Promise((r) => setTimeout(r, 1000))

  // TODO: substituir por auth.api.deleteUser()
  return { ok: true }
}

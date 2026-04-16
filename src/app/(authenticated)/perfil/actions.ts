"use server"

import { z } from "zod"
import { perfilService } from "@/services/perfil"

type ActionResult = { ok: true } | { ok: false; error: string }

const nomeSchema = z
  .string()
  .min(2, "O nome deve ter pelo menos 2 caracteres.")
  .max(100, "O nome deve ter no máximo 100 caracteres.")

export async function atualizarNome(nome: string): Promise<ActionResult> {
  const parsed = nomeSchema.safeParse(nome)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0].message }
  }

  return perfilService.atualizarNome(parsed.data)
}

export async function excluirConta(): Promise<ActionResult> {
  return perfilService.excluirConta()
}

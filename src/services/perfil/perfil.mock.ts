import type { PerfilService } from "./types"

export const perfilServiceMock: PerfilService = {
  async atualizarNome(_nome: string) {
    await new Promise((r) => setTimeout(r, 500))
    return { ok: true as const }
  },

  async excluirConta() {
    await new Promise((r) => setTimeout(r, 1000))
    return { ok: true as const }
  },
}

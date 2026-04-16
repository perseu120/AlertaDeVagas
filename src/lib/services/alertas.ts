import type { Alerta } from "@/lib/schemas/alerta"
import { alertasMock } from "@/lib/mock/alertas"

// ---------------------------------------------------------------------------
// TODO: quando a API estiver pronta, substitua o corpo de cada função abaixo
// por uma chamada fetch ao endpoint correspondente, mantendo a mesma assinatura.
//
// Exemplo:
//   export async function getAlertas() {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/alertas`, {
//       headers: { Cookie: cookies().toString() },
//     })
//     if (!res.ok) throw new Error("Falha ao buscar alertas")
//     return res.json() as Promise<Alerta[]>
//   }
// ---------------------------------------------------------------------------

export async function getAlertas(): Promise<Alerta[]> {
  return [...alertasMock]
}

export async function getAlertaById(id: string): Promise<Alerta | null> {
  // TODO: substituir por fetch(`${process.env.NEXT_PUBLIC_URL}/api/alertas/${id}`)
  return alertasMock.find((a) => a.id === id) ?? null
}

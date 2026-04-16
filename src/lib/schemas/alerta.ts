import { z } from "zod"

export const frequenciaEnum = z.enum(["imediato", "diario", "semanal"], {
  message: "Frequência inválida",
})

export const modalidadeAlertaEnum = z.enum(["online", "presencial", "todas"], {
  message: "Modalidade inválida",
})

export const alertaSchema = z.object({
  id: z.string(),
  nome: z.string(),
  palavrasChave: z.array(z.string()),
  modalidade: modalidadeAlertaEnum,
  frequencia: frequenciaEnum,
  ativo: z.boolean(),
  criadoEm: z.string(),
})

export const alertaFormSchema = z.object({
  nome: z
    .string({ required_error: "O nome é obrigatório" })
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(60, "O nome deve ter no máximo 60 caracteres"),
  palavrasChave: z
    .string({ required_error: "Informe pelo menos uma palavra-chave" })
    .min(2, "Informe pelo menos uma palavra-chave"),
  modalidade: modalidadeAlertaEnum,
  frequencia: frequenciaEnum,
})

export type Alerta = z.infer<typeof alertaSchema>
export type Frequencia = z.infer<typeof frequenciaEnum>
export type AlertaFormValues = z.infer<typeof alertaFormSchema>

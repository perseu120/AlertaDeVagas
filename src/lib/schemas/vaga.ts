import { z } from "zod"

export const modalidadeEnum = z.enum(["online", "presencial"], {
  message: "Modalidade inválida",
})

export const vagaSchema = z.object({
  id: z.string(),
  nome: z.string(),
  descricao: z.string(),
  data: z.string(),             // data do encontro, ISO 8601
  vagasMax: z.number(),
  vagasDisponiveis: z.number(),
  modalidade: modalidadeEnum,
  localizacao: z.string().nullable(), // endereço para eventos presenciais
  urlInscricao: z.string().url().nullable(),
  criadoEm: z.string(),
})

export const vagaFiltrosSchema = z.object({
  q: z.string().optional(),
  modalidade: modalidadeEnum.optional(),
  apenasComVagas: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).default(1),
})

export type Vaga = z.infer<typeof vagaSchema>
export type Modalidade = z.infer<typeof modalidadeEnum>
export type VagaFiltros = z.infer<typeof vagaFiltrosSchema>

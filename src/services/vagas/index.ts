import { vagaServiceMock } from "./vagas.mock"
import type { VagaService } from "./types"

// Troque a implementação aqui quando a API estiver pronta:
//   import { vagaServiceApi } from "./vagas.api"
//   export const vagaService: VagaService = vagaServiceApi
export const vagaService: VagaService = vagaServiceMock

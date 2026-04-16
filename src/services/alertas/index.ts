import { alertaServiceMock } from "./alertas.mock"
import type { AlertaService } from "./types"

// Troque a implementação aqui quando a API estiver pronta:
//   import { alertaServiceApi } from "./alertas.api"
//   export const alertaService: AlertaService = alertaServiceApi
export const alertaService: AlertaService = alertaServiceMock

import { perfilServiceMock } from "./perfil.mock"
import type { PerfilService } from "./types"

// Troque a implementação aqui quando a API estiver pronta:
//   import { perfilServiceApi } from "./perfil.api"
//   export const perfilService: PerfilService = perfilServiceApi
export const perfilService: PerfilService = perfilServiceMock

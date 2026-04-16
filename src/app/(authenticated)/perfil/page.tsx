import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PerfilForm } from "./_components/perfil-form"
import { PerfilDeleteAccount } from "./_components/perfil-delete-account"

export const metadata = {
  title: "Perfil",
}

export default async function PerfilPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  const nome = session?.user.name ?? ""
  const email = session?.user.email ?? ""
  const criadoEm = session?.user.createdAt
    ? new Date(session.user.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—"

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Perfil</h1>
      <p className="mt-1 text-muted-foreground">
        Gerencie suas informações pessoais.
      </p>

      <div className="mt-8 space-y-6">
        {/* Dados da conta (somente leitura) */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da conta</CardTitle>
            <CardDescription>
              Dados vinculados à sua autenticação.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Membro desde
              </p>
              <p className="text-sm">{criadoEm}</p>
            </div>
          </CardContent>
        </Card>

        {/* Edição de nome */}
        <Card>
          <CardHeader>
            <CardTitle>Dados pessoais</CardTitle>
            <CardDescription>
              Atualize seu nome de exibição.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PerfilForm nomeAtual={nome} />
          </CardContent>
        </Card>

        <Separator />

        {/* Zona de perigo */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Zona de perigo</CardTitle>
            <CardDescription>
              Ações irreversíveis sobre sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PerfilDeleteAccount />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

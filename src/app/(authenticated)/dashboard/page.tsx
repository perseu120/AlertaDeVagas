import Link from "next/link"
import { Bell, BriefcaseIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata = { title: "Dashboard" }

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Início</h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie suas vagas e alertas em um só lugar.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BriefcaseIcon className="h-5 w-5" />
              Vagas disponíveis
            </CardTitle>
            <CardDescription>
              Explore as oportunidades abertas no momento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/vagas">Ver vagas</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Meus alertas
            </CardTitle>
            <CardDescription>
              Configure alertas para ser notificado sobre novas vagas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/alertas">Gerenciar alertas</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

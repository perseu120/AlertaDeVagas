// TODO: reativar guard de sessão após validação da Fase 2
import { Navbar } from "@/components/navbar/navbar"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  )
}

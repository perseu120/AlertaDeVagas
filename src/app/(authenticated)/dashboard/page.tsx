import { ButtonSignOut } from "./_components/button-signout"

export const metadata = { title: "Dashboard" }

export default function Dashboard() {
  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center flex-col">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-4">Bem-vindo ao AlertaDeVagas</p>
      <ButtonSignOut />
    </div>
  )
}

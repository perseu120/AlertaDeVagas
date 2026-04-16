import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { NavbarMobile } from "./navbar-mobile"
import { NavbarSignOut } from "./navbar-signout"

export async function Navbar() {
  const session = await auth.api.getSession({ headers: await headers() })
  const userName = session?.user.name ?? "Usuário"

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/dashboard" className="text-lg font-bold tracking-tight">
          AlertaDeVagas
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/vagas"
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            Vagas
          </Link>
          <Link
            href="/alertas"
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            Alertas
          </Link>
          <Link
            href="/perfil"
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            Perfil
          </Link>
        </nav>

        {/* Ações desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <span className="text-sm text-muted-foreground">{userName}</span>
          <ThemeToggle />
          <NavbarSignOut />
        </div>

        {/* Toggle tema + hamburguer mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <NavbarMobile userName={userName} />
        </div>
      </div>
    </header>
  )
}

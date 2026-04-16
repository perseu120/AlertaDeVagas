"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

interface NavbarMobileProps {
  userName: string
}

export function NavbarMobile({ userName }: NavbarMobileProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.replace("/"),
      },
    })
  }

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {open && (
        <div className="absolute left-0 top-16 z-50 w-full border-b bg-background px-4 pb-4 shadow-sm">
          <nav className="flex flex-col gap-1 pt-2">
            <p className="px-3 py-2 text-sm font-medium text-muted-foreground">
              {userName}
            </p>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              Início
            </Link>
            <Link
              href="/vagas"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              Vagas
            </Link>
            <Link
              href="/alertas"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              Alertas
            </Link>
            <Link
              href="/perfil"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              Perfil
            </Link>
            <Button
              variant="ghost"
              className="justify-start px-3 text-sm font-medium text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              Sair
            </Button>
          </nav>
        </div>
      )}
    </div>
  )
}

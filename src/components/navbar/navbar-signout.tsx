"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export function NavbarSignOut() {
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.replace("/"),
      },
    })
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut}>
      Sair
    </Button>
  )
}

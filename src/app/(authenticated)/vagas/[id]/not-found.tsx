import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VagaNotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-2xl font-bold">Vaga não encontrada</h2>
      <p className="text-muted-foreground max-w-sm">
        Esta vaga pode ter sido encerrada ou o link está incorreto.
      </p>
      <Button asChild>
        <Link href="/vagas">Ver todas as vagas</Link>
      </Button>
    </div>
  )
}

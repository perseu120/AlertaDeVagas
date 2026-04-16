import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EmptyStateProps {
  titulo: string
  descricao: string
  rotulo?: string
  href?: string
}

export function EmptyState({ titulo, descricao, rotulo, href }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="rounded-full bg-muted p-6">
        <span className="text-4xl">🔍</span>
      </div>
      <div className="max-w-sm space-y-1">
        <h3 className="text-lg font-semibold">{titulo}</h3>
        <p className="text-sm text-muted-foreground">{descricao}</p>
      </div>
      {rotulo && href && (
        <Button asChild>
          <Link href={href}>{rotulo}</Link>
        </Button>
      )}
    </div>
  )
}

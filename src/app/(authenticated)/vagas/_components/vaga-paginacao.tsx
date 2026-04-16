"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface VagaPaginacaoProps {
  paginaAtual: number
  totalPaginas: number
}

export function VagaPaginacao({ paginaAtual, totalPaginas }: VagaPaginacaoProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPaginas <= 1) return null

  function irPara(pagina: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(pagina))
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <Button
        variant="outline"
        size="icon"
        onClick={() => irPara(paginaAtual - 1)}
        disabled={paginaAtual <= 1}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <span className="text-sm text-muted-foreground">
        Página {paginaAtual} de {totalPaginas}
      </span>

      <Button
        variant="outline"
        size="icon"
        onClick={() => irPara(paginaAtual + 1)}
        disabled={paginaAtual >= totalPaginas}
        aria-label="Próxima página"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

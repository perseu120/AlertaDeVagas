"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function VagaFiltros() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const atualizar = useCallback(
    (chave: string, valor: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (valor) {
        params.set(chave, valor)
      } else {
        params.delete(chave)
      }
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  function limpar() {
    router.push(pathname)
  }

  const temFiltro =
    searchParams.has("q") ||
    searchParams.has("modalidade") ||
    searchParams.has("apenasComVagas")

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {/* Busca por nome */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome do encontro..."
          className="pl-9"
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => atualizar("q", e.target.value)}
        />
      </div>

      {/* Modalidade */}
      <Select
        defaultValue={searchParams.get("modalidade") ?? "todas"}
        onValueChange={(v) => atualizar("modalidade", v === "todas" ? "" : v)}
      >
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="Modalidade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas</SelectItem>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="presencial">Presencial</SelectItem>
        </SelectContent>
      </Select>

      {/* Apenas com vagas */}
      <div className="flex items-center gap-2">
        <Switch
          id="apenasComVagas"
          checked={searchParams.get("apenasComVagas") === "true"}
          onCheckedChange={(v) => atualizar("apenasComVagas", v ? "true" : "")}
        />
        <Label htmlFor="apenasComVagas" className="text-sm cursor-pointer">
          Apenas com vagas
        </Label>
      </div>

      {/* Limpar filtros */}
      {temFiltro && (
        <Button variant="ghost" size="sm" onClick={limpar} className="gap-1">
          <X className="h-4 w-4" />
          Limpar
        </Button>
      )}
    </div>
  )
}

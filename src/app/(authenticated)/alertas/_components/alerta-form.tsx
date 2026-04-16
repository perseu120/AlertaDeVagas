"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { alertaFormSchema, type AlertaFormValues, type Alerta } from "@/lib/schemas/alerta"
import { criarAlerta, editarAlerta } from "../actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AlertaFormProps {
  alerta?: Alerta
}

export function AlertaForm({ alerta }: AlertaFormProps) {
  const router = useRouter()
  const isEdicao = !!alerta

  const form = useForm<AlertaFormValues>({
    resolver: zodResolver(alertaFormSchema),
    defaultValues: {
      nome: alerta?.nome ?? "",
      palavrasChave: alerta?.palavrasChave.join(", ") ?? "",
      modalidade: alerta?.modalidade ?? "todas",
      frequencia: alerta?.frequencia ?? "diario",
    },
  })

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(values: AlertaFormValues) {
    const result = isEdicao
      ? await editarAlerta(alerta.id, values)
      : await criarAlerta(values)

    if (!result.ok) {
      toast.error(result.error)
      return
    }

    toast.success(isEdicao ? "Alerta atualizado!" : "Alerta criado com sucesso!")
    router.push("/alertas")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Nome */}
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do alerta</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Encontros de React online"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Palavras-chave */}
        <FormField
          control={form.control}
          name="palavrasChave"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Palavras-chave</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: React, TypeScript, Python"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Separe por vírgula. Você será notificado quando um encontro contiver essas palavras no nome.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Modalidade */}
          <FormField
            control={form.control}
            name="modalidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modalidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="presencial">Presencial</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Frequência */}
          <FormField
            control={form.control}
            name="frequencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequência de notificação</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="imediato">Imediato</SelectItem>
                    <SelectItem value="diario">Diário</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdicao ? "Salvando..." : "Criando..."}
              </>
            ) : isEdicao ? (
              "Salvar alterações"
            ) : (
              "Criar alerta"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/alertas")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}

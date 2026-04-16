import { Skeleton } from "@/components/ui/skeleton"

export default function PerfilLoading() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="mt-1 h-4 w-48" />

      <div className="mt-8 space-y-6">
        {/* Card informações */}
        <div className="rounded-xl border p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>

        {/* Card edição */}
        <div className="rounded-xl border p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-36" />
        </div>

        <Skeleton className="h-px w-full" />

        {/* Card zona de perigo */}
        <div className="rounded-xl border p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  )
}

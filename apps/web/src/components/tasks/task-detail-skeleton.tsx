export function TaskDetailSkeleton() {
  return (
    <div className="space-y-6 max-w-2xl animate-pulse">
      <div className="h-6 w-2/3 rounded bg-zinc-800" />

      <div className="h-20 rounded bg-zinc-800" />

      <div className="flex gap-4">
        <div className="h-10 w-[200px] rounded bg-zinc-800" />
        <div className="h-10 w-[200px] rounded bg-zinc-800" />
      </div>

      <div className="space-y-2">
        <div className="h-4 w-1/3 rounded bg-zinc-800" />
        <div className="h-4 w-1/2 rounded bg-zinc-800" />
      </div>

      <div className="space-y-3">
        <div className="h-16 rounded bg-zinc-800" />
        <div className="h-16 rounded bg-zinc-800" />
      </div>
    </div>
  )
}
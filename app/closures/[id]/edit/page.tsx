import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { ProjectClosure } from "@/lib/types"
import { ClosureForm } from "@/components/closure-form"

export default async function EditClosurePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: closure, error } = await supabase.from("project_closures").select("*").eq("id", id).single()

  if (error || !closure) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Editar Cierre de Proyecto</h1>
            <p className="text-blue-200/70">{closure.project_name}</p>
          </div>
          <ClosureForm closure={closure as ProjectClosure} />
        </div>
      </div>
    </div>
  )
}

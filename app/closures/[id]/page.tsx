import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { ProjectClosure } from "@/lib/types"
import { ClosureDetailView } from "@/components/closure-detail-view"

export default async function ClosureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: closure, error } = await supabase.from("project_closures").select("*").eq("id", id).single()

  if (error || !closure) {
    notFound()
  }

  return <ClosureDetailView closure={closure as ProjectClosure} />
}

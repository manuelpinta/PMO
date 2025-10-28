import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { ProjectWithClosure } from "@/lib/types"
import { StakeholderView } from "@/components/stakeholder-view"

export default async function SharedClosurePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()

  const { data: closure, error } = await supabase
    .from("project_closures")
    .select(
      `
      *,
      projects (*)
    `,
    )
    .eq("share_token", token)
    .eq("is_published", true)
    .single()

  if (error || !closure) {
    notFound()
  }

  // Transform the data structure to match ProjectWithClosure
  const project = closure.projects as any
  const projectWithClosure: ProjectWithClosure = {
    ...project,
    project_closures: [closure],
  }

  return <StakeholderView project={projectWithClosure} closure={closure} />
}

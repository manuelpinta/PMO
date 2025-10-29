import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ClosureDetailView } from "@/components/closure-detail-view"

export default async function SharedClosurePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()

  const { data: closure, error } = await supabase
    .from("project_closures")
    .select("*")
    .eq("share_token", token)
    .not("share_token", "is", null)
    .single()

  if (error || !closure) {
    notFound()
  }

  return <ClosureDetailView closure={closure} isSharedView={true} />
}

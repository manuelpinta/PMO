"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function deleteClosure(closureId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("project_closures").delete().eq("id", closureId)

  if (error) {
    console.error("[v0] Error deleting closure:", error)
    return { error: error.message }
  }

  revalidatePath("/")
  redirect("/")
}

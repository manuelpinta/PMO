"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function generateShareToken(closureId: string) {
  const supabase = await createClient()

  // Check if closure already has a share token
  const { data: existing } = await supabase.from("project_closures").select("share_token").eq("id", closureId).single()

  if (existing?.share_token) {
    return { success: true, token: existing.share_token }
  }

  // Generate a unique token
  const token = crypto.randomUUID()

  const { error } = await supabase
    .from("project_closures")
    .update({ share_token: token, is_published: true })
    .eq("id", closureId)

  if (error) {
    console.error("[v0] Error generating share token:", error)
    return { success: false, error: "Error al generar el enlace de compartir" }
  }

  revalidatePath(`/projects`)
  return { success: true, token }
}

export async function revokeShareToken(closureId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("project_closures")
    .update({ share_token: null, is_published: false })
    .eq("id", closureId)

  if (error) {
    console.error("[v0] Error revoking share token:", error)
    return { success: false, error: "Error al revocar el enlace" }
  }

  revalidatePath(`/projects`)
  return { success: true }
}

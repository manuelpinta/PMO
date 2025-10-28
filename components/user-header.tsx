"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface UserHeaderProps {
  userEmail?: string
}

export function UserHeader({ userEmail }: UserHeaderProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <div className="flex items-center gap-4">
      {userEmail && (
        <div className="flex items-center gap-2 text-blue-200/70">
          <User className="h-4 w-4" />
          <span className="text-sm">{userEmail}</span>
        </div>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="border-blue-700 text-blue-300 hover:bg-blue-950 bg-transparent"
      >
        <LogOut className="h-4 w-4 mr-2" />
        {isLoggingOut ? "Saliendo..." : "Cerrar Sesión"}
      </Button>
    </div>
  )
}

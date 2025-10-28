import { createClient } from "@/lib/supabase/server"
import type { ProjectClosure } from "@/lib/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FolderOpen, Calendar, User } from "lucide-react"
import { UserHeader } from "@/components/user-header"

export default async function DashboardPage() {
  const supabase = await createClient()

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    console.error("[v0] Error getting user:", error)
  }

  let projectClosures: ProjectClosure[] = []
  try {
    const { data: closures, error } = await supabase
      .from("project_closures")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching closures:", error)
    } else {
      projectClosures = (closures || []) as ProjectClosure[]
    }
  } catch (error) {
    console.error("[v0] Database error:", error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-blue-900/50 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Cierres de Proyectos</h1>
              <p className="text-blue-200/70 mt-1">Gestiona y comparte los cierres de tus proyectos</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/closures/create">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-5 w-5" />
                  Nuevo Cierre
                </Button>
              </Link>
              <UserHeader userEmail={user?.email} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {projectClosures.length === 0 ? (
          <Card className="border-blue-900/50 bg-slate-950/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FolderOpen className="h-16 w-16 text-blue-400/50 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No hay cierres de proyectos</h2>
              <p className="text-blue-200/70 mb-6 text-center max-w-md">
                Comienza creando tu primer cierre de proyecto
              </p>
              <Link href="/closures/create">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primer Cierre
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projectClosures.map((closure) => {
              return (
                <Card
                  key={closure.id}
                  className="border-blue-900/50 bg-slate-950/50 backdrop-blur-sm hover:border-blue-700/70 transition-all hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="default" className="bg-blue-600">
                        {closure.project_id}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-xl">{closure.project_name}</CardTitle>
                    <CardDescription className="text-blue-200/70">
                      {closure.area || "Sin área asignada"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      {closure.project_manager && (
                        <div className="flex items-center text-blue-200/70">
                          <User className="h-4 w-4 mr-2 text-blue-400" />
                          <span>PM: {closure.project_manager}</span>
                        </div>
                      )}
                      {closure.actual_close_date && (
                        <div className="flex items-center text-blue-200/70">
                          <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                          <span>Cerrado: {new Date(closure.actual_close_date).toLocaleDateString("es-MX")}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 pt-4">
                      <Link href={`/closures/${closure.id}`} className="w-full">
                        <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700">
                          Ver Cierre
                        </Button>
                      </Link>
                      <Link href={`/closures/${closure.id}/edit`} className="w-full">
                        <Button
                          variant="outline"
                          className="w-full border-blue-700 text-blue-300 hover:bg-blue-950 bg-transparent"
                        >
                          Editar
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

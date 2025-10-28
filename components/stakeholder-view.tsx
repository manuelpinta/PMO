import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface StakeholderViewProps {
  closure: any
}

export function StakeholderView({ closure }: StakeholderViewProps) {
  const hasValue = (value: any) => {
    return value !== null && value !== undefined && value !== ""
  }

  const formatDate = (date: string | null) => {
    if (!date) return null
    return new Date(date).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-blue-900/50 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-400">{closure.project_name}</h1>
              <p className="text-blue-200/70 mt-1">Cierre de Proyecto</p>
            </div>
            {hasValue(closure.project_id) && <Badge className="bg-blue-600 text-white">{closure.project_id}</Badge>}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Project Info */}
        <Card className="border-blue-900/50 bg-slate-900/50 backdrop-blur-sm mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {hasValue(closure.sponsor) && (
                <div>
                  <p className="text-blue-400 font-medium mb-1">Sponsor</p>
                  <p className="text-blue-200/70">{closure.sponsor}</p>
                </div>
              )}
              {hasValue(closure.project_manager) && (
                <div>
                  <p className="text-blue-400 font-medium mb-1">PM</p>
                  <p className="text-blue-200/70">{closure.project_manager}</p>
                </div>
              )}
              {hasValue(closure.area) && (
                <div>
                  <p className="text-blue-400 font-medium mb-1">Área</p>
                  <p className="text-blue-200/70">{closure.area}</p>
                </div>
              )}
              {hasValue(closure.actual_close_date) && (
                <div>
                  <p className="text-blue-400 font-medium mb-1">Fecha de Cierre</p>
                  <p className="text-blue-200/70">{formatDate(closure.actual_close_date)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Executive Summary - Main Content for Stakeholders */}
        {hasValue(closure.executive_summary) && (
          <Card className="border-blue-900/50 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-blue-400">Resumen Ejecutivo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-blue-200/90 leading-relaxed whitespace-pre-wrap">{closure.executive_summary}</p>
              </div>

              {/* Key Results Summary */}
              {(hasValue(closure.time_result) ||
                hasValue(closure.cost_result) ||
                hasValue(closure.scope_result) ||
                hasValue(closure.user_satisfaction)) && (
                <div>
                  <h3 className="text-blue-300 font-semibold mb-3">Resultados Clave</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {hasValue(closure.time_result) && (
                      <div className="bg-slate-950/50 p-3 rounded-lg border border-blue-900/30">
                        <p className="text-blue-400 text-sm mb-1">Tiempo</p>
                        <p className="text-white font-medium">{closure.time_result}</p>
                      </div>
                    )}
                    {hasValue(closure.cost_result) && (
                      <div className="bg-slate-950/50 p-3 rounded-lg border border-blue-900/30">
                        <p className="text-blue-400 text-sm mb-1">Costo</p>
                        <p className="text-white font-medium">{closure.cost_result}</p>
                      </div>
                    )}
                    {hasValue(closure.scope_result) && (
                      <div className="bg-slate-950/50 p-3 rounded-lg border border-blue-900/30">
                        <p className="text-blue-400 text-sm mb-1">Alcance</p>
                        <p className="text-white font-medium">{closure.scope_result}</p>
                      </div>
                    )}
                    {hasValue(closure.user_satisfaction) && (
                      <div className="bg-slate-950/50 p-3 rounded-lg border border-blue-900/30">
                        <p className="text-blue-400 text-sm mb-1">Satisfacción</p>
                        <p className="text-white font-medium">{closure.user_satisfaction}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-blue-200/50 text-sm">
            Este es un resumen del cierre de proyecto. Para más información, contacta al Project Manager.
          </p>
        </div>
      </main>
    </div>
  )
}

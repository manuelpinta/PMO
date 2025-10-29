import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShareDialog } from "@/components/share-dialog"
import { ExportButtons } from "@/components/export-buttons"
import Link from "next/link"
import { ArrowLeft, ExternalLink, FolderOpen, Edit } from "lucide-react"
import { DeleteClosureDialog } from "@/components/delete-closure-dialog"

interface ClosureDetailViewProps {
  closure: any
  isSharedView?: boolean
}

export function ClosureDetailView({ closure, isSharedView = false }: ClosureDetailViewProps) {
  const formatDate = (date: string | null) => {
    if (!date) return null
    return new Date(date).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const hasValue = (value: any) => {
    return value !== null && value !== undefined && value !== ""
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-blue-900/50 bg-gradient-to-r from-blue-900 to-blue-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isSharedView && (
                <Link href="/">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-blue-800">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              <h1 className="text-2xl font-bold text-white">{closure.project_name}</h1>
            </div>
            {!isSharedView && (
              <div className="flex items-center gap-2">
                <ExportButtons closure={closure} />
                <Link href={`/closures/${closure.id}/edit`}>
                  <Button variant="ghost" className="text-white hover:bg-blue-800">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </Link>
                <DeleteClosureDialog closureId={closure.id} projectName={closure.project_name} />
                <ShareDialog closureId={closure.id} existingToken={closure.share_token} />
              </div>
            )}
            {isSharedView && <Badge className="bg-white text-blue-900">CIERRE DE PROYECTO</Badge>}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Project Info Card */}
          <Card className="border-blue-900/50 bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-3 text-sm">
                {hasValue(closure.project_id) && (
                  <div>
                    <p className="text-blue-400 mb-1">ID</p>
                    <p className="text-white font-medium">{closure.project_id}</p>
                  </div>
                )}
                {hasValue(closure.sponsor) && (
                  <div>
                    <p className="text-blue-400 mb-1">Sponsor</p>
                    <p className="text-white font-medium">{closure.sponsor}</p>
                  </div>
                )}
                {hasValue(closure.project_manager) && (
                  <div>
                    <p className="text-blue-400 mb-1">PM</p>
                    <p className="text-white font-medium">{closure.project_manager}</p>
                  </div>
                )}
                {hasValue(closure.area) && (
                  <div>
                    <p className="text-blue-400 mb-1">Área</p>
                    <p className="text-white font-medium">{closure.area}</p>
                  </div>
                )}
                {hasValue(closure.start_date) && (
                  <div>
                    <p className="text-blue-400 mb-1">Inicio</p>
                    <p className="text-white font-medium">{formatDate(closure.start_date)}</p>
                  </div>
                )}
                {hasValue(closure.planned_close_date) && (
                  <div>
                    <p className="text-blue-400 mb-1">Cierre planificado</p>
                    <p className="text-white font-medium">{formatDate(closure.planned_close_date)}</p>
                  </div>
                )}
                {hasValue(closure.actual_close_date) && (
                  <div>
                    <p className="text-blue-400 mb-1">Cierre real</p>
                    <p className="text-white font-medium">{formatDate(closure.actual_close_date)}</p>
                  </div>
                )}
                {hasValue(closure.approved_budget) && (
                  <div>
                    <p className="text-blue-400 mb-1">Presupuesto aprobado</p>
                    <p className="text-white font-medium">{closure.approved_budget}</p>
                  </div>
                )}
                {hasValue(closure.actual_cost) && (
                  <div>
                    <p className="text-blue-400 mb-1">Costo real</p>
                    <p className="text-white font-medium">{closure.actual_cost}</p>
                  </div>
                )}
                {hasValue(closure.credit_note_expected) && (
                  <div>
                    <p className="text-blue-400 mb-1">Esperado por Nota de Crédito</p>
                    <p className="text-white font-medium">{closure.credit_note_expected}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Executive Summary */}
          {hasValue(closure.executive_summary) && (
            <Card className="border-blue-900/50 bg-slate-900/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold text-blue-400 mb-4">Resumen ejecutivo</h2>
                <p className="text-white leading-relaxed whitespace-pre-wrap">{closure.executive_summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Final Deliverables */}
          {closure.final_deliverables && closure.final_deliverables.length > 0 && (
            <Card className="border-blue-900/50 bg-slate-900/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold text-blue-400 mb-4">Entregables finales</h2>
                <ul className="space-y-2">
                  {closure.final_deliverables
                    .filter((d: any) => hasValue(d.name) || hasValue(d.link))
                    .map((deliverable: any, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-white">
                        <span className="text-blue-400">•</span>
                        <span>
                          {hasValue(deliverable.name) && <strong>{deliverable.name}</strong>}
                          {hasValue(deliverable.link) && (
                            <>
                              {" — "}
                              <a
                                href={deliverable.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1"
                              >
                                enlace/ubicación
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </>
                          )}
                        </span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Results vs Objectives */}
          {(hasValue(closure.time_result) ||
            hasValue(closure.cost_result) ||
            hasValue(closure.scope_result) ||
            hasValue(closure.estimated_benefit) ||
            hasValue(closure.user_satisfaction) ||
            hasValue(closure.materialized_risks)) && (
            <Card className="border-blue-900/50 bg-slate-900/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold text-blue-400 mb-4">Resultados vs objetivos</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Left column */}
                  <div className="space-y-4">
                    {hasValue(closure.time_result) && (
                      <div>
                        <p className="text-blue-300 text-sm mb-1">Tiempo</p>
                        <p className="text-white font-medium">{closure.time_result}</p>
                      </div>
                    )}
                    {hasValue(closure.cost_result) && (
                      <div>
                        <p className="text-blue-300 text-sm mb-1">Costo</p>
                        <p className="text-white font-medium">{closure.cost_result}</p>
                      </div>
                    )}
                    {hasValue(closure.scope_result) && (
                      <div>
                        <p className="text-blue-300 text-sm mb-1">Alcance</p>
                        <p className="text-white font-medium">{closure.scope_result}</p>
                      </div>
                    )}
                  </div>
                  {/* Right column */}
                  <div className="space-y-4">
                    {hasValue(closure.estimated_benefit) && (
                      <div>
                        <p className="text-blue-300 text-sm mb-1">Beneficio estimado</p>
                        <p className="text-white font-medium">{closure.estimated_benefit}</p>
                      </div>
                    )}
                    {hasValue(closure.user_satisfaction) && (
                      <div>
                        <p className="text-blue-300 text-sm mb-1">Satisfacción del usuario</p>
                        <p className="text-white font-medium">{closure.user_satisfaction}</p>
                      </div>
                    )}
                    {hasValue(closure.materialized_risks) && (
                      <div>
                        <p className="text-blue-300 text-sm mb-1">Riesgos materializados</p>
                        <p className="text-white font-medium">{closure.materialized_risks}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lessons Learned */}
          {((closure.lessons_repeat && closure.lessons_repeat.some((l: string) => hasValue(l))) ||
            (closure.lessons_improve && closure.lessons_improve.some((l: string) => hasValue(l))) ||
            (closure.lessons_recommendations && closure.lessons_recommendations.some((l: string) => hasValue(l)))) && (
            <Card className="border-blue-900/50 bg-slate-900/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold text-blue-400 mb-4">Lecciones aprendidas</h2>
                <div className="space-y-4">
                  {closure.lessons_repeat && closure.lessons_repeat.some((l: string) => hasValue(l)) && (
                    <div>
                      <Badge variant="outline" className="mb-2 border-blue-700 text-blue-300 bg-blue-950/50">
                        ¿Qué repetir?
                      </Badge>
                      <ul className="space-y-1">
                        {closure.lessons_repeat
                          .filter((l: string) => hasValue(l))
                          .map((lesson: string, index: number) => (
                            <li key={index} className="text-white flex items-start gap-2">
                              <span className="text-blue-400">•</span>
                              <span>{lesson}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                  {closure.lessons_improve && closure.lessons_improve.some((l: string) => hasValue(l)) && (
                    <div>
                      <Badge variant="outline" className="mb-2 border-blue-700 text-blue-300 bg-blue-950/50">
                        ¿Qué mejorar?
                      </Badge>
                      <ul className="space-y-1">
                        {closure.lessons_improve
                          .filter((l: string) => hasValue(l))
                          .map((lesson: string, index: number) => (
                            <li key={index} className="text-white flex items-start gap-2">
                              <span className="text-blue-400">•</span>
                              <span>{lesson}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                  {closure.lessons_recommendations &&
                    closure.lessons_recommendations.some((l: string) => hasValue(l)) && (
                      <div>
                        <Badge variant="outline" className="mb-2 border-blue-700 text-blue-300 bg-blue-950/50">
                          Recomendaciones
                        </Badge>
                        <ul className="space-y-1">
                          {closure.lessons_recommendations
                            .filter((l: string) => hasValue(l))
                            .map((lesson: string, index: number) => (
                              <li key={index} className="text-white flex items-start gap-2">
                                <span className="text-blue-400">•</span>
                                <span>{lesson}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transition to Operations */}
          {(hasValue(closure.process_owner) ||
            hasValue(closure.documentation_link) ||
            hasValue(closure.support_channel) ||
            hasValue(closure.handover_date)) && (
            <Card className="border-blue-900/50 bg-slate-900/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold text-blue-400 mb-4">Transición a operación / Soporte</h2>
                <div className="space-y-3 text-white">
                  {hasValue(closure.process_owner) && (
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        <strong>Propietario del proceso/sistema:</strong> {closure.process_owner}
                      </span>
                    </div>
                  )}
                  {hasValue(closure.documentation_link) && (
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        <strong>Manual / documentación:</strong>{" "}
                        <a
                          href={closure.documentation_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1"
                        >
                          Carpeta del proyecto
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </span>
                    </div>
                  )}
                  {hasValue(closure.support_channel) && (
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        <strong>Canal de soporte:</strong> {closure.support_channel}
                      </span>
                    </div>
                  )}
                  {hasValue(closure.handover_date) && (
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        <strong>Fecha de handover:</strong> {formatDate(closure.handover_date)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <ExportButtons closure={closure} />
            {hasValue(closure.documentation_link) && (
              <Button asChild variant="default" className="flex-1 bg-cyan-600 hover:bg-cyan-700">
                <a href={closure.documentation_link} target="_blank" rel="noopener noreferrer">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Abrir carpeta del proyecto
                </a>
              </Button>
            )}
            {!isSharedView && (
              <Button
                asChild
                variant="outline"
                className="flex-1 border-blue-700 text-blue-300 hover:bg-blue-950 bg-transparent"
              >
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al inicio
                </Link>
              </Button>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-center text-sm text-blue-200/70 pt-4">
            <p>
              Este documento forma parte del proceso de cierre de proyectos. Informe de Governance/GallCo.
              <br />
              Conserva este correo y consulta la carpeta del proyecto para información completa.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

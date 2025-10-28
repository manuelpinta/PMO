"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

interface ClosureFormProps {
  closure?: any
}

export function ClosureForm({ closure }: ClosureFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    // Header
    project_name: closure?.project_name || "",
    project_id: closure?.project_id || "",
    sponsor: closure?.sponsor || "",
    project_manager: closure?.project_manager || "",
    area: closure?.area || "",

    // Dates
    start_date: closure?.start_date || "",
    planned_close_date: closure?.planned_close_date || "",
    actual_close_date: closure?.actual_close_date || "",

    // Budget
    approved_budget: closure?.approved_budget || "",
    actual_cost: closure?.actual_cost || "",
    credit_note_expected: closure?.credit_note_expected || "",

    // Executive summary
    executive_summary: closure?.executive_summary || "",

    // Transition
    process_owner: closure?.process_owner || "",
    documentation_link: closure?.documentation_link || "",
    support_channel: closure?.support_channel || "",
    handover_date: closure?.handover_date || "",
  })

  const [deliverables, setDeliverables] = useState<Array<{ name: string; link: string }>>(
    closure?.final_deliverables || [{ name: "", link: "" }],
  )

  const [results, setResults] = useState({
    time_result: closure?.time_result || "",
    cost_result: closure?.cost_result || "",
    scope_result: closure?.scope_result || "",
    estimated_benefit: closure?.estimated_benefit || "",
    user_satisfaction: closure?.user_satisfaction || "",
    materialized_risks: closure?.materialized_risks || "",
  })

  const [lessonsRepeat, setLessonsRepeat] = useState<string[]>(closure?.lessons_repeat || [""])
  const [lessonsImprove, setLessonsImprove] = useState<string[]>(closure?.lessons_improve || [""])
  const [lessonsRecommendations, setLessonsRecommendations] = useState<string[]>(
    closure?.lessons_recommendations || [""],
  )

  const addDeliverable = () => {
    setDeliverables([...deliverables, { name: "", link: "" }])
  }

  const removeDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index))
  }

  const updateDeliverable = (index: number, field: "name" | "link", value: string) => {
    const updated = [...deliverables]
    updated[index][field] = value
    setDeliverables(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    console.log("[v0] Starting form submission...")

    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("[v0] No user found")
      alert("Debes iniciar sesión")
      setLoading(false)
      return
    }

    console.log("[v0] User found:", user.id)

    const cleanData = (obj: any) => {
      const cleaned: any = {}
      for (const key in obj) {
        const value = obj[key]
        // Convert empty strings to null, keep other values as-is
        cleaned[key] = value === "" ? null : value
      }
      return cleaned
    }

    const data = {
      user_id: user.id,
      ...cleanData(formData),
      final_deliverables: deliverables.filter((d) => d.name || d.link), // Only include non-empty deliverables
      ...cleanData(results),
      lessons_repeat: lessonsRepeat.filter((l) => l.trim() !== ""), // Only include non-empty lessons
      lessons_improve: lessonsImprove.filter((l) => l.trim() !== ""),
      lessons_recommendations: lessonsRecommendations.filter((l) => l.trim() !== ""),
    }

    console.log("[v0] Prepared data:", data)

    try {
      if (closure) {
        console.log("[v0] Updating closure:", closure.id)
        const { error } = await supabase.from("project_closures").update(data).eq("id", closure.id)
        if (error) {
          console.error("[v0] Update error:", error)
          throw error
        }
        console.log("[v0] Closure updated successfully")
      } else {
        console.log("[v0] Creating new closure")
        const { error } = await supabase.from("project_closures").insert([data])
        if (error) {
          console.error("[v0] Insert error:", error)
          throw error
        }
        console.log("[v0] Closure created successfully")
      }

      router.push("/")
      router.refresh()
    } catch (error: any) {
      console.error("[v0] Error saving closure:", error)
      const errorMessage = error?.message || "Error desconocido"
      alert(`Error al guardar el cierre: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-blue-900/50 bg-slate-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Información del Proyecto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project_name" className="text-blue-200">
              Nombre del Proyecto
            </Label>
            <Input
              id="project_name"
              value={formData.project_name}
              onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
              className="bg-slate-950/50 border-blue-900/50 text-white"
              placeholder="Ej: Nueva aplicacion proyectos"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project_id" className="text-blue-200">
                ID del Proyecto
              </Label>
              <Input
                id="project_id"
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                className="bg-slate-950/50 border-blue-900/50 text-white"
                placeholder="ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sponsor" className="text-blue-200">
                Sponsor
              </Label>
              <Input
                id="sponsor"
                value={formData.sponsor}
                onChange={(e) => setFormData({ ...formData, sponsor: e.target.value })}
                className="bg-slate-950/50 border-blue-900/50 text-white"
                placeholder="Nombre del sponsor"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_manager" className="text-blue-200">
                PM (Project Manager)
              </Label>
              <Input
                id="project_manager"
                value={formData.project_manager}
                onChange={(e) => setFormData({ ...formData, project_manager: e.target.value })}
                className="bg-slate-950/50 border-blue-900/50 text-white"
                placeholder="Nombre del PM"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area" className="text-blue-200">
                Área
              </Label>
              <Input
                id="area"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="bg-slate-950/50 border-blue-900/50 text-white"
                placeholder="Ej: Project Management Office (PMO)"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-900/50 bg-slate-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Fechas y Presupuesto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Left column - Dates */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="start_date" className="text-blue-200">
                  Inicio
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="bg-slate-950/50 border-blue-900/50 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="planned_close_date" className="text-blue-200">
                  Cierre planificado
                </Label>
                <Input
                  id="planned_close_date"
                  type="date"
                  value={formData.planned_close_date}
                  onChange={(e) => setFormData({ ...formData, planned_close_date: e.target.value })}
                  className="bg-slate-950/50 border-blue-900/50 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="actual_close_date" className="text-blue-200">
                  Cierre real
                </Label>
                <Input
                  id="actual_close_date"
                  type="date"
                  value={formData.actual_close_date}
                  onChange={(e) => setFormData({ ...formData, actual_close_date: e.target.value })}
                  className="bg-slate-950/50 border-blue-900/50 text-white"
                />
              </div>
            </div>

            {/* Right column - Budget */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="approved_budget" className="text-blue-200">
                  Presupuesto aprobado
                </Label>
                <Input
                  id="approved_budget"
                  type="text"
                  value={formData.approved_budget}
                  onChange={(e) => setFormData({ ...formData, approved_budget: e.target.value })}
                  className="bg-slate-950/50 border-blue-900/50 text-white"
                  placeholder="$150,000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="actual_cost" className="text-blue-200">
                  Costo real
                </Label>
                <Input
                  id="actual_cost"
                  type="text"
                  value={formData.actual_cost}
                  onChange={(e) => setFormData({ ...formData, actual_cost: e.target.value })}
                  className="bg-slate-950/50 border-blue-900/50 text-white"
                  placeholder="$[monto]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credit_note_expected" className="text-blue-200">
                  Esperado por Nota de Crédito
                </Label>
                <Input
                  id="credit_note_expected"
                  value={formData.credit_note_expected}
                  onChange={(e) => setFormData({ ...formData, credit_note_expected: e.target.value })}
                  className="bg-slate-950/50 border-blue-900/50 text-white"
                  placeholder="[+/- % / $]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executive Summary */}
      <Card className="border-blue-900/50 bg-slate-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Resumen ejecutivo</CardTitle>
          <CardDescription className="text-blue-200/70">
            3-4 líneas: objetivo, alcance logrado, resultado principal, impacto para operación/comercial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              id="executive_summary"
              value={formData.executive_summary}
              onChange={(e) => setFormData({ ...formData, executive_summary: e.target.value })}
              rows={4}
              className="bg-slate-950/50 border-blue-900/50 text-white"
              placeholder="Describe el objetivo, alcance logrado, resultado principal e impacto..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Deliverables */}
      <Card className="border-blue-900/50 bg-slate-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Entregables finales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {deliverables.map((deliverable, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label className="text-blue-200">Entregable {index + 1}</Label>
                <Input
                  value={deliverable.name}
                  onChange={(e) => updateDeliverable(index, "name", e.target.value)}
                  className="bg-slate-950/50 border-blue-900/50 text-white"
                  placeholder="Nombre del entregable"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label className="text-blue-200">Enlace/Ubicación</Label>
                <Input
                  value={deliverable.link}
                  onChange={(e) => updateDeliverable(index, "link", e.target.value)}
                  className="bg-slate-950/50 border-blue-900/50 text-white"
                  placeholder="https://..."
                />
              </div>
              {deliverables.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeDeliverable(index)}
                  className="border-red-700 text-red-400 hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addDeliverable}
            className="w-full border-blue-700 text-blue-300 hover:bg-blue-950 bg-transparent"
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Entregable
          </Button>
        </CardContent>
      </Card>

      <Card className="border-blue-900/50 bg-slate-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Resultados vs objetivos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Left column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="time_result" className="text-blue-200">
                  Tiempo
                </Label>
                <Input
                  id="time_result"
                  value={results.time_result}
                  onChange={(e) => setResults({ ...results, time_result: e.target.value })}
                  className="bg-slate-950/50 border-blue-900/50 text-white"
                  placeholder="[Cumplido / +X días]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost_result" className="text-blue-200">
                  Costo
                </Label>
                <Input
                  id="cost_result"
                  value={results.cost_result}
                  onChange={(e) => setResults({ ...results, cost_result: e.target.value })}
                  className="bg-slate-950/50 border-blue-900/50 text-white"
                  placeholder="[En presupuesto / +X%]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope_result" className="text-blue-200">
                  Alcance
                </Label>
                <Input
                  id="scope_result"
                  value={results.scope_result}
                  onChange={(e) => setResults({ ...results, scope_result: e.target.value })}
                  className="bg-slate-950/50 border-blue-900/50 text-white"
                  placeholder="[100% / Pendientes: X]"
                />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="estimated_benefit" className="text-blue-200">
                  Beneficio estimado
                </Label>
                <Input
                  id="estimated_benefit"
                  value={results.estimated_benefit}
                  onChange={(e) => setResults({ ...results, estimated_benefit: e.target.value })}
                  className="bg-slate-950/50 border-blue-900/50 text-white"
                  placeholder="$[ahorros/ROI]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user_satisfaction" className="text-blue-200">
                  Satisfacción del usuario
                </Label>
                <Input
                  id="user_satisfaction"
                  value={results.user_satisfaction}
                  onChange={(e) => setResults({ ...results, user_satisfaction: e.target.value })}
                  className="bg-slate-950/50 border-blue-900/50 text-white"
                  placeholder="[NPS/Encuesta]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="materialized_risks" className="text-blue-200">
                  Riesgos materializados
                </Label>
                <Input
                  id="materialized_risks"
                  value={results.materialized_risks}
                  onChange={(e) => setResults({ ...results, materialized_risks: e.target.value })}
                  className="bg-slate-950/50 border-blue-900/50 text-white"
                  placeholder="[Breve lista]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Learned */}
      <Card className="border-blue-900/50 bg-slate-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Lecciones aprendidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-blue-200">¿Qué repetir?</Label>
            {lessonsRepeat.map((lesson, index) => (
              <Input
                key={index}
                value={lesson}
                onChange={(e) => {
                  const updated = [...lessonsRepeat]
                  updated[index] = e.target.value
                  setLessonsRepeat(updated)
                }}
                className="bg-slate-950/50 border-blue-900/50 text-white"
                placeholder="[Qué repetir]"
              />
            ))}
          </div>

          <div className="space-y-2">
            <Label className="text-blue-200">¿Qué mejorar?</Label>
            {lessonsImprove.map((lesson, index) => (
              <Input
                key={index}
                value={lesson}
                onChange={(e) => {
                  const updated = [...lessonsImprove]
                  updated[index] = e.target.value
                  setLessonsImprove(updated)
                }}
                className="bg-slate-950/50 border-blue-900/50 text-white"
                placeholder="[Qué mejorar]"
              />
            ))}
          </div>

          <div className="space-y-2">
            <Label className="text-blue-200">Recomendaciones</Label>
            {lessonsRecommendations.map((lesson, index) => (
              <Input
                key={index}
                value={lesson}
                onChange={(e) => {
                  const updated = [...lessonsRecommendations]
                  updated[index] = e.target.value
                  setLessonsRecommendations(updated)
                }}
                className="bg-slate-950/50 border-blue-900/50 text-white"
                placeholder="[Recomendaciones]"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transition */}
      <Card className="border-blue-900/50 bg-slate-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Transición a operación / Soporte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="process_owner" className="text-blue-200">
              Propietario del proceso/sistema
            </Label>
            <Input
              id="process_owner"
              value={formData.process_owner}
              onChange={(e) => setFormData({ ...formData, process_owner: e.target.value })}
              className="bg-slate-950/50 border-blue-900/50 text-white"
              placeholder="[Área/Nombre]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentation_link" className="text-blue-200">
              Manual / documentación (Link)
            </Label>
            <Input
              id="documentation_link"
              value={formData.documentation_link}
              onChange={(e) => setFormData({ ...formData, documentation_link: e.target.value })}
              className="bg-slate-950/50 border-blue-900/50 text-white"
              placeholder="Carpeta del proyecto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="support_channel" className="text-blue-200">
              Canal de soporte
            </Label>
            <Input
              id="support_channel"
              value={formData.support_channel}
              onChange={(e) => setFormData({ ...formData, support_channel: e.target.value })}
              className="bg-slate-950/50 border-blue-900/50 text-white"
              placeholder="[CONTACT_EMAIL]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="handover_date" className="text-blue-200">
              Fecha de handover
            </Label>
            <Input
              id="handover_date"
              type="date"
              value={formData.handover_date}
              onChange={(e) => setFormData({ ...formData, handover_date: e.target.value })}
              className="bg-slate-950/50 border-blue-900/50 text-white"
              placeholder="[AAAA-MM-DD]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Link href="/" className="flex-1">
          <Button
            type="button"
            variant="outline"
            className="w-full border-blue-700 text-blue-300 hover:bg-blue-950 bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
        </Link>
        <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Guardando..." : closure ? "Actualizar Cierre" : "Crear Cierre"}
        </Button>
      </div>
    </form>
  )
}

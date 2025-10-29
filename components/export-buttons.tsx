"use client"

import { Button } from "@/components/ui/button"
import { Download, FileText, FileCode } from "lucide-react"
import type { ProjectClosure } from "@/lib/types"

interface ExportButtonsProps {
  closure: ProjectClosure
}

export function ExportButtons({ closure }: ExportButtonsProps) {
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

  const generateHTML = () => {
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cierre de Proyecto - ${closure.project_name}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    .header {
      background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    .info-item {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
    }
    .info-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .info-value {
      font-size: 16px;
      font-weight: bold;
      color: #1e3a8a;
    }
    .section {
      margin-bottom: 40px;
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
    }
    .section h2 {
      color: #1e3a8a;
      font-size: 20px;
      margin-top: 0;
      margin-bottom: 15px;
      border-bottom: 2px solid #1e3a8a;
      padding-bottom: 10px;
    }
    .list-item {
      margin: 10px 0;
      padding: 10px;
      background: white;
      border-left: 3px solid #1e3a8a;
      padding-left: 15px;
    }
    .badge {
      display: inline-block;
      background: #1e3a8a;
      color: white;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      margin-bottom: 10px;
    }
    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
    @media print {
      body { margin: 0; padding: 10px; }
      .section { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${closure.project_name}</h1>
    <p>Cierre de Proyecto</p>
  </div>

  <div class="info-grid">
    ${hasValue(closure.project_id) ? `
    <div class="info-item">
      <div class="info-label">ID del Proyecto</div>
      <div class="info-value">${closure.project_id}</div>
    </div>
    ` : ""}
    ${hasValue(closure.sponsor) ? `
    <div class="info-item">
      <div class="info-label">Sponsor</div>
      <div class="info-value">${closure.sponsor}</div>
    </div>
    ` : ""}
    ${hasValue(closure.project_manager) ? `
    <div class="info-item">
      <div class="info-label">Project Manager</div>
      <div class="info-value">${closure.project_manager}</div>
    </div>
    ` : ""}
  </div>

  ${hasValue(closure.executive_summary) ? `
  <div class="section">
    <h2>Resumen Ejecutivo</h2>
    <p>${closure.executive_summary.replace(/\n/g, "<br>")}</p>
  </div>
  ` : ""}

  ${hasValue(closure.final_deliverables) && closure.final_deliverables.length > 0 ? `
  <div class="section">
    <h2>Entregables Finales</h2>
    ${closure.final_deliverables
      .filter((d: any) => hasValue(d.name) || hasValue(d.link))
      .map(
        (d: any) => `
      <div class="list-item">
        <strong>${d.name || "Entregable"}</strong>
        ${hasValue(d.link) ? `<br><a href="${d.link}">${d.link}</a>` : ""}
      </div>
      `
      )
      .join("")}
  </div>
  ` : ""}

  ${(hasValue(closure.time_result) ||
    hasValue(closure.cost_result) ||
    hasValue(closure.scope_result)) ? `
  <div class="section">
    <h2>Resultados vs Objetivos</h2>
    <div class="two-column">
      ${hasValue(closure.time_result) ? `
      <div class="list-item">
        <strong>Tiempo:</strong> ${closure.time_result}
      </div>
      ` : ""}
      ${hasValue(closure.cost_result) ? `
      <div class="list-item">
        <strong>Costo:</strong> ${closure.cost_result}
      </div>
      ` : ""}
      ${hasValue(closure.scope_result) ? `
      <div class="list-item">
        <strong>Alcance:</strong> ${closure.scope_result}
      </div>
      ` : ""}
      ${hasValue(closure.estimated_benefit) ? `
      <div class="list-item">
        <strong>Beneficio Estimado:</strong> ${closure.estimated_benefit}
      </div>
      ` : ""}
      ${hasValue(closure.user_satisfaction) ? `
      <div class="list-item">
        <strong>Satisfacción del Usuario:</strong> ${closure.user_satisfaction}
      </div>
      ` : ""}
      ${hasValue(closure.materialized_risks) ? `
      <div class="list-item">
        <strong>Riesgos Materializados:</strong> ${closure.materialized_risks}
      </div>
      ` : ""}
    </div>
  </div>
  ` : ""}

  ${((closure.lessons_repeat && closure.lessons_repeat.some((l: string) => hasValue(l))) ||
    (closure.lessons_improve && closure.lessons_improve.some((l: string) => hasValue(l))) ||
    (closure.lessons_recommendations && closure.lessons_recommendations.some((l: string) => hasValue(l)))) ? `
  <div class="section">
    <h2>Lecciones Aprendidas</h2>
    ${closure.lessons_repeat && closure.lessons_repeat.some((l: string) => hasValue(l)) ? `
    <h3>¿Qué repetir?</h3>
    ${closure.lessons_repeat
      .filter((l: string) => hasValue(l))
      .map((lesson: string) => `<div class="list-item">${lesson}</div>`)
      .join("")}
    ` : ""}
    ${closure.lessons_improve && closure.lessons_improve.some((l: string) => hasValue(l)) ? `
    <h3>¿Qué mejorar?</h3>
    ${closure.lessons_improve
      .filter((l: string) => hasValue(l))
      .map((lesson: string) => `<div class="list-item">${lesson}</div>`)
      .join("")}
    ` : ""}
    ${closure.lessons_recommendations && closure.lessons_recommendations.some((l: string) => hasValue(l)) ? `
    <h3>Recomendaciones</h3>
    ${closure.lessons_recommendations
      .filter((l: string) => hasValue(l))
      .map((lesson: string) => `<div class="list-item">${lesson}</div>`)
      .join("")}
    ` : ""}
  </div>
  ` : ""}

  ${(hasValue(closure.process_owner) ||
    hasValue(closure.documentation_link) ||
    hasValue(closure.support_channel)) ? `
  <div class="section">
    <h2>Transición a Operación</h2>
    ${hasValue(closure.process_owner) ? `
    <div class="list-item">
      <strong>Propietario del Proceso:</strong> ${closure.process_owner}
    </div>
    ` : ""}
    ${hasValue(closure.documentation_link) ? `
    <div class="list-item">
      <strong>Documentación:</strong> <a href="${closure.documentation_link}">${closure.documentation_link}</a>
    </div>
    ` : ""}
    ${hasValue(closure.support_channel) ? `
    <div class="list-item">
      <strong>Canal de Soporte:</strong> ${closure.support_channel}
    </div>
    ` : ""}
    ${hasValue(closure.handover_date) ? `
    <div class="list-item">
      <strong>Fecha de Handover:</strong> ${formatDate(closure.handover_date)}
    </div>
    ` : ""}
  </div>
  ` : ""}

  <div class="footer">
    <p>Este documento forma parte del proceso de cierre de proyectos. Informe de Governance/GallCo.</p>
    <p>Generado el ${new Date().toLocaleDateString("es-MX")}</p>
  </div>
</body>
</html>
    `

    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cierre-${closure.project_id}-${new Date().toISOString().split("T")[0]}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generatePDF = () => {
    // Add print styles
    const style = document.createElement("style")
    style.textContent = `
      @media print {
        body { margin: 0; padding: 20px; }
        .bg-gradient-to-br, .bg-gradient-to-r { background: #1e3a8a !important; }
        .text-blue-200, .text-blue-300, .text-blue-400 { color: #1e3a8a !important; }
        .border-blue-900, .border-blue-900\\/50 { border-color: #1e40af !important; }
        button, .hidden { display: none !important; }
        .container { max-width: 100% !important; }
      }
    `
    document.head.appendChild(style)
    window.print()
    document.head.removeChild(style)
  }

  return (
    <div className="flex gap-2">
      <Button onClick={generatePDF} variant="outline" className="border-blue-700 text-blue-300 hover:bg-blue-950">
        <FileText className="mr-2 h-4 w-4" />
        Exportar PDF
      </Button>
      <Button onClick={generateHTML} variant="outline" className="border-blue-700 text-blue-300 hover:bg-blue-950">
        <FileCode className="mr-2 h-4 w-4" />
        Exportar HTML
      </Button>
    </div>
  )
}


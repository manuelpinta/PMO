"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Share2, Copy, Check, Loader2, Link2Off, FileCode } from "lucide-react"
import { generateShareToken, revokeShareToken } from "@/app/actions/share"
import type { ProjectClosure } from "@/lib/types"

interface ShareDialogProps {
  closureId: string
  existingToken?: string | null
  closure: ProjectClosure
}

export function ShareDialog({ closureId, existingToken, closure }: ShareDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareToken, setShareToken] = useState(existingToken)

  const shareUrl = shareToken ? `${window.location.origin}/share/${shareToken}` : ""

  const handleGenerateLink = async () => {
    setLoading(true)
    const result = await generateShareToken(closureId)
    setLoading(false)

    if (result.success && result.token) {
      setShareToken(result.token)
    } else {
      alert(result.error || "Error al generar el enlace")
    }
  }

  const handleCopyLink = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRevokeLink = async () => {
    if (confirm("¿Estás seguro de que deseas revocar el enlace de compartir?")) {
      setLoading(true)
      const result = await revokeShareToken(closureId)
      setLoading(false)

      if (result.success) {
        setShareToken(null)
      } else {
        alert(result.error || "Error al revocar el enlace")
      }
    }
  }

  const generateHTML = () => {
    const formatDate = (date: string | null) => {
      if (!date) return ""
      return new Date(date).toLocaleDateString("es-MX", { year: "numeric", month: "2-digit", day: "2-digit" })
    }

    const hasValue = (value: any) => value !== null && value !== undefined && value !== ""

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${closure.project_name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      color: #333;
      line-height: 1.5;
    }
    .container { 
      max-width: 1000px; 
      margin: 0 auto; 
      background: white;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      border-radius: 8px;
      overflow: hidden;
    }
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px 30px;
    }
    .header h1 { font-size: 24px; margin-bottom: 5px; }
    .header p { font-size: 13px; opacity: 0.9; }
    .content { padding: 20px 30px; }
    .grid { 
      display: grid; 
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 15px;
    }
    .info-item { 
      background: #f8f9fa;
      padding: 8px 12px;
      border-radius: 4px;
      border-left: 3px solid #667eea;
    }
    .info-label { font-size: 11px; color: #666; text-transform: uppercase; margin-bottom: 3px; }
    .info-value { font-size: 13px; color: #333; font-weight: 600; }
    .section { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
    .section-title { color: #667eea; font-size: 16px; font-weight: bold; margin-bottom: 10px; }
    .text-content { padding: 12px; background: #f8f9fa; border-radius: 4px; white-space: pre-wrap; font-size: 13px; }
    .list { padding-left: 20px; }
    .list li { margin: 4px 0; font-size: 13px; }
    .footer { padding: 15px 30px; background: #f8f9fa; text-align: center; font-size: 11px; color: #666; }
    @media print { body { padding: 0; background: white; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${closure.project_name}</h1>
      <p>${closure.project_id} - ${closure.area || "PMO"}</p>
    </div>
    
    <div class="content">
      <div class="grid">
        ${hasValue(closure.sponsor) ? `<div class="info-item"><div class="info-label">Sponsor</div><div class="info-value">${closure.sponsor}</div></div>` : ""}
        ${hasValue(closure.project_manager) ? `<div class="info-item"><div class="info-label">Project Manager</div><div class="info-value">${closure.project_manager}</div></div>` : ""}
        ${hasValue(closure.start_date) ? `<div class="info-item"><div class="info-label">Inicio</div><div class="info-value">${formatDate(closure.start_date)}</div></div>` : ""}
        ${hasValue(closure.actual_close_date) ? `<div class="info-item"><div class="info-label">Cierre Real</div><div class="info-value">${formatDate(closure.actual_close_date)}</div></div>` : ""}
        ${hasValue(closure.approved_budget) ? `<div class="info-item"><div class="info-label">Presupuesto</div><div class="info-value">$${closure.approved_budget}</div></div>` : ""}
        ${hasValue(closure.actual_cost) ? `<div class="info-item"><div class="info-label">Costo Real</div><div class="info-value">$${closure.actual_cost}</div></div>` : ""}
      </div>

      ${hasValue(closure.executive_summary) ? `
      <div class="section">
        <div class="section-title">Resumen Ejecutivo</div>
        <div class="text-content">${closure.executive_summary}</div>
      </div>
      ` : ""}

      ${closure.final_deliverables && closure.final_deliverables.length > 0 ? `
      <div class="section">
        <div class="section-title">Entregables Finales</div>
        <ul class="list">
          ${closure.final_deliverables.filter((d: any) => hasValue(d.name) || hasValue(d.link)).map((d: any) => 
            `<li><strong>${d.name || "Entregable"}</strong>${hasValue(d.link) ? ` - <a href="${d.link}">ver</a>` : ""}</li>`
          ).join("")}
        </ul>
      </div>
      ` : ""}
    </div>
    
    <div class="footer">
      <p>Documento de cierre de proyecto - Generado el ${new Date().toLocaleDateString("es-MX")}</p>
    </div>
  </div>
</body>
</html>`

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

  const handleExportHTML = () => {
    setOpen(false)
    setTimeout(() => {
      generateHTML()
    }, 100)
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-white hover:bg-blue-800">
          <Share2 className="mr-2 h-4 w-4" />
          Compartir / Exportar
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-blue-900/50 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Compartir y Exportar</DialogTitle>
          <DialogDescription className="text-blue-200/70">
            Comparte con un enlace público o exporta el cierre de proyecto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="border-b border-blue-900/50 pb-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">Compartir enlace</h3>
            <div className="space-y-3">
              {shareToken ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="share-url" className="text-blue-200">Enlace de compartir</Label>
                    <div className="flex gap-2">
                      <Input id="share-url" value={shareUrl} readOnly className="bg-slate-950/50 border-blue-900/50 text-white" />
                      <Button onClick={handleCopyLink} variant="outline" className="border-blue-700 text-blue-300 hover:bg-blue-950 bg-transparent">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-blue-200/70">Cualquier persona con este enlace podrá ver el cierre del proyecto.</p>
                  </div>
                  <Button onClick={handleRevokeLink} disabled={loading} variant="outline" size="sm" className="border-red-700 text-red-400 hover:bg-red-950 bg-transparent">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link2Off className="mr-2 h-4 w-4" />}
                    Revocar enlace
                  </Button>
                </>
              ) : (
                <Button onClick={handleGenerateLink} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />}
                  Generar enlace de compartir
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">Exportar documento</h3>
            <Button onClick={handleExportHTML} variant="outline" className="w-full border-blue-700 text-blue-300 hover:bg-blue-950 bg-transparent">
              <FileCode className="mr-2 h-4 w-4" />
              Exportar HTML
            </Button>
            <p className="text-xs text-blue-200/70">
              Descarga un archivo HTML con toda la información del cierre de proyecto
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


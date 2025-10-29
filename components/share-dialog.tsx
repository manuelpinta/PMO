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
import { Share2, Copy, Check, Loader2, Link2Off, FileText, FileCode, Download } from "lucide-react"
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

  const handleExportHTML = () => {
    setOpen(false)
    
    setTimeout(() => {
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
  <title>Cierre de Proyecto - ${closure.project_name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      color: #333;
      line-height: 1.6;
    }
    .container { 
      max-width: 1000px; 
      margin: 0 auto; 
      background: white;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      border-radius: 12px;
      overflow: hidden;
    }
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 40px;
      text-align: center;
    }
    .header h1 { font-size: 28px; margin-bottom: 10px; }
    .header p { font-size: 14px; opacity: 0.9; }
    .content { padding: 30px 40px; }
    .section { margin-bottom: 25px; }
    .section-title { 
      color: #667eea;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #667eea;
    }
    .grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
      gap: 15px;
    }
    .info-item { 
      padding: 12px;
      background: #f8f9fa;
      border-radius: 6px;
      border-left: 4px solid #667eea;
    }
    .info-label { 
      font-size: 12px; 
      color: #666;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .info-value { 
      font-size: 14px; 
      color: #333;
      font-weight: 600;
    }
    .text-content { 
      padding: 15px;
      background: #f8f9fa;
      border-radius: 6px;
      white-space: pre-wrap;
    }
    .list { padding-left: 20px; }
    .list li { margin: 8px 0; }
    .footer {
      padding: 20px 40px;
      background: #f8f9fa;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    @media print {
      body { padding: 10px; background: white; }
      .container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${closure.project_name}</h1>
      <p>Cierre de Proyecto</p>
    </div>
    
    <div class="content">
      <div class="section">
        <div class="section-title">Información del Proyecto</div>
        <div class="grid">
          ${hasValue(closure.project_id) ? `<div class="info-item"><div class="info-label">ID</div><div class="info-value">${closure.project_id}</div></div>` : ""}
          ${hasValue(closure.sponsor) ? `<div class="info-item"><div class="info-label">Sponsor</div><div class="info-value">${closure.sponsor}</div></div>` : ""}
          ${hasValue(closure.project_manager) ? `<div class="info-item"><div class="info-label">Project Manager</div><div class="info-value">${closure.project_manager}</div></div>` : ""}
          ${hasValue(closure.area) ? `<div class="info-item"><div class="info-label">Área</div><div class="info-value">${closure.area}</div></div>` : ""}
          ${hasValue(closure.start_date) ? `<div class="info-item"><div class="info-label">Inicio</div><div class="info-value">${formatDate(closure.start_date)}</div></div>` : ""}
          ${hasValue(closure.actual_close_date) ? `<div class="info-item"><div class="info-label">Cierre</div><div class="info-value">${formatDate(closure.actual_close_date)}</div></div>` : ""}
        </div>
      </div>

      ${hasValue(closure.executive_summary) ? `
      <div class="section">
        <div class="section-title">Resumen Ejecutivo</div>
        <div class="text-content">${closure.executive_summary.replace(/\\n/g, "<br>")}</div>
      </div>
      ` : ""}

      ${hasValue(closure.final_deliverables) && closure.final_deliverables.length > 0 ? `
      <div class="section">
        <div class="section-title">Entregables Finales</div>
        <ul class="list">
          ${closure.final_deliverables.filter((d: any) => hasValue(d.name) || hasValue(d.link)).map((d: any, i: number) => `
            <li><strong>${d.name || "Entregable"}</strong>${hasValue(d.link) ? ` - <a href="${d.link}" target="_blank">${d.link}</a>` : ""}</li>
          `).join("")}
        </ul>
      </div>
      ` : ""}
    </div>
    
    <div class="footer">
      <p>Este documento forma parte del proceso de cierre de proyectos.</p>
      <p>Generado el ${new Date().toLocaleDateString("es-MX")}</p>
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
    }, 100)
  }

  const handleExportPDF = () => {
    setOpen(false)
    
    setTimeout(() => {
      const style = document.createElement("style")
      style.textContent = `
        @media print {
          @page { margin: 0.5cm; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { 
            margin: 0; 
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          }
          .container { 
            max-width: 100%;
            margin: 0;
            box-shadow: none !important;
          }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important; }
          .section-title { border-color: #667eea !important; }
          .info-item { border-left-color: #667eea !important; }
          button, nav, header > div:last-child { display: none !important; }
          .min-h-screen { min-height: auto !important; }
        }
      `
      document.head.appendChild(style)
      window.print()
      document.head.removeChild(style)
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
          {/* Share Link Section */}
          <div className="border-b border-blue-900/50 pb-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">Compartir enlace</h3>
            <div className="space-y-3">
              {shareToken ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="share-url" className="text-blue-200">
                      Enlace de compartir
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="share-url"
                        value={shareUrl}
                        readOnly
                        className="bg-slate-950/50 border-blue-900/50 text-white"
                      />
                      <Button
                        onClick={handleCopyLink}
                        variant="outline"
                        className="border-blue-700 text-blue-300 hover:bg-blue-950 bg-transparent"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-blue-200/70">
                      Cualquier persona con este enlace podrá ver el cierre del proyecto.
                    </p>
                  </div>

                  <Button
                    onClick={handleRevokeLink}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="border-red-700 text-red-400 hover:bg-red-950 bg-transparent"
                  >
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

          {/* Export Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">Exportar documento</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleExportPDF}
                variant="outline"
                className="border-blue-700 text-blue-300 hover:bg-blue-950 bg-transparent"
              >
                <FileText className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
              <Button
                onClick={handleExportHTML}
                variant="outline"
                className="border-blue-700 text-blue-300 hover:bg-blue-950 bg-transparent"
              >
                <FileCode className="mr-2 h-4 w-4" />
                Exportar HTML
              </Button>
            </div>
            <p className="text-xs text-blue-200/70">
              El PDF se guardará mediante la impresora del navegador. Selecciona "Guardar como PDF" como destino.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


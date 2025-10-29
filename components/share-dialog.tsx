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
    window.print()
  }

  const handleExportPDF = () => {
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
                Imprimir
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


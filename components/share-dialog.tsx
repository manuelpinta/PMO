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
import { Share2, Copy, Check, Loader2, Link2Off } from "lucide-react"
import { generateShareToken, revokeShareToken } from "@/app/actions/share"

interface ShareDialogProps {
  closureId: string
  existingToken?: string | null
}

export function ShareDialog({ closureId, existingToken }: ShareDialogProps) {
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-blue-900 hover:bg-blue-50">
          <Share2 className="mr-2 h-4 w-4" />
          Compartir
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-blue-900/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Compartir Cierre de Proyecto</DialogTitle>
          <DialogDescription className="text-blue-200/70">
            Genera un enlace público para compartir este cierre de proyecto con otras personas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
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
                <p className="text-sm text-blue-200/70">
                  Cualquier persona con este enlace podrá ver el cierre del proyecto.
                </p>
              </div>

              <Button
                onClick={handleRevokeLink}
                disabled={loading}
                variant="outline"
                className="w-full border-red-700 text-red-400 hover:bg-red-950 bg-transparent"
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
      </DialogContent>
    </Dialog>
  )
}

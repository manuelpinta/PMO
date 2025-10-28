"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import { deleteClosure } from "@/app/actions/delete-closure"

interface DeleteClosureDialogProps {
  closureId: string
  projectName: string
}

export function DeleteClosureDialog({ closureId, projectName }: DeleteClosureDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteClosure(closureId)
    } catch (error) {
      console.error("[v0] Error deleting closure:", error)
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-red-400 hover:bg-red-950 hover:text-red-300">
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-blue-900/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">¿Eliminar cierre de proyecto?</DialogTitle>
          <DialogDescription className="text-slate-300">
            Estás a punto de eliminar el cierre del proyecto <strong className="text-white">{projectName}</strong>. Esta
            acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting} className="border-blue-700">
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

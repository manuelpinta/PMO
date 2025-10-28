import { ClosureForm } from "@/components/closure-form"

export default function NewClosurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Nuevo Cierre de Proyecto</h1>
            <p className="text-blue-200/70">Completa la información del cierre del proyecto</p>
          </div>
          <ClosureForm />
        </div>
      </div>
    </div>
  )
}

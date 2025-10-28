import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, CheckCircle2 } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">PMO - Cierres de Proyectos</h1>
          <p className="text-slate-400">Sistema de gestión de cierres para Project Managers</p>
        </div>

        <Card className="border-blue-900/20 bg-slate-900/80 backdrop-blur-sm shadow-2xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <CardTitle className="text-2xl text-blue-400">¡Cuenta Creada!</CardTitle>
            </div>
            <CardDescription className="text-slate-400">Verifica tu correo electrónico</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-950/30 border border-blue-900/30">
              <p className="text-sm text-slate-300 leading-relaxed">
                Te hemos enviado un correo de confirmación. Por favor verifica tu cuenta antes de iniciar sesión.
              </p>
            </div>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 h-11">
              <Link href="/auth/login">Ir a Iniciar Sesión</Link>
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-500 mt-6">Revisa tu bandeja de entrada y spam</p>
      </div>
    </div>
  )
}

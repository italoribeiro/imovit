// app/(platform)/admin/analysis/[id]/loading.tsx
import { BrainCircuit, Loader2 } from 'lucide-react'

export default function LoadingAnalysis() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="relative">
        <BrainCircuit size={64} className="text-brand-500 animate-pulse" />
        <Loader2 className="absolute -bottom-2 -right-2 animate-spin text-slate-400" size={24} />
      </div>
      <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase">
        Consultando Gemini 1.5 Flash...
      </h2>
      <p className="text-slate-500 font-medium animate-bounce text-sm">
        Gerando diagnóstico estratégico e score de fechamento.
      </p>
    </div>
  )
}
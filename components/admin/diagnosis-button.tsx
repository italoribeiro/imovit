'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BrainCircuit, Loader2 } from 'lucide-react'

export function DiagnosisButton({ id }: { id: number }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handleNavigation = () => {
    setIsProcessing(true)
    // Inicia a navegação para a página de análise
    router.push(`/platform/admin/analysis/${id}`)
  }

  return (
    <button
      onClick={handleNavigation}
      disabled={isProcessing}
      className={`p-3 rounded-xl transition-all shadow-sm flex items-center justify-center min-w-[44px] ${
        isProcessing 
          ? 'bg-brand-100 text-brand-600 cursor-wait' 
          : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-900 hover:text-white'
      }`}
      title="Ver Diagnóstico IA"
    >
      {isProcessing ? (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" size={18} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Processando...</span>
        </div>
      ) : (
        <BrainCircuit size={18} />
      )}
    </button>
  )
}
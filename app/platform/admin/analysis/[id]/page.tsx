import { analyzeProposal } from '@/app/actions/ai-analysis'
import { BrainCircuit, ArrowLeft, Target, ShieldCheck, MessageSquare, Zap } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AIAnalysisPage({ params }: PageProps) {
  const { id } = await params
  const analysis = await analyzeProposal(Number(id))

  if (analysis.error) return (
    <div className="p-10 bg-red-50 border border-red-100 rounded-3xl text-red-700 font-bold">
       Erro: {analysis.error}
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header de Navegação */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Link href="/platform/admin/proposals" className="flex items-center gap-2 text-slate-500 hover:text-brand-600 font-bold transition-all group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          VOLTAR PARA PROPOSTAS
        </Link>
        <div className="flex items-center gap-3 bg-brand-50 text-brand-700 px-5 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest border border-brand-100 shadow-sm">
          <BrainCircuit size={16} className="text-brand-500" /> 
          Powered by Gemini 1.5 Flash
        </div>
      </div>

      {/* Bloco Principal: O Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap size={120} />
           </div>
           <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                  strokeDasharray={552}
                  strokeDashoffset={552 - (552 * (analysis.score || 0)) / 100}
                  className="text-brand-500 transition-all duration-1000 ease-out" 
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-6xl font-black text-slate-900 tracking-tighter">{analysis.score}</span>
           </div>
           <h2 className="mt-6 text-xl font-bold text-slate-900">Score de Negócio</h2>
           <p className="text-slate-400 text-xs mt-2 font-medium">Probabilidade de fechamento baseada no histórico de mercado.</p>
        </div>

        {/* Card de Diagnóstico */}
        <div className="lg:col-span-2 bg-slate-900 p-10 rounded-[3.5rem] text-white flex flex-col justify-center relative shadow-2xl shadow-slate-200">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Target className="text-brand-400" size={32} /> Diagnóstico da IA
          </h2>
          <p className="text-xl text-slate-200 leading-relaxed font-medium italic opacity-90">
            "{analysis.diagnostic}"
          </p>
          <div className="mt-10 flex gap-4">
            <div className="flex-1 bg-white/5 p-5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block mb-1">Análise de Valor</span>
              <p className="text-lg font-black uppercase">Oferta Competitiva</p>
            </div>
            <div className="flex-1 bg-white/5 p-5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block mb-1">Status do Imóvel</span>
              <p className="text-lg font-black uppercase">Alta Demanda</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Estratégia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" /> Pontos Fortes & Riscos
          </h3>
          <p className="text-slate-600 leading-relaxed font-medium">{analysis.strategy}</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MessageSquare className="text-blue-500" /> Script Sugerido
          </h3>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 italic text-slate-500 text-sm leading-relaxed">
            "Olá, recebi sua proposta pelo terreno na CE-040. Notei seu interesse genuíno e gostaria de alinhar os próximos passos..."
          </div>
          <p className="text-[10px] text-slate-400 mt-4 text-center font-bold uppercase tracking-widest">Use este script para iniciar o contato via WhatsApp</p>
        </div>
      </div>
    </div>
  )
}
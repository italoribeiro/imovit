import Link from 'next/link'
import { UserCircle, Sparkles } from 'lucide-react' 

export function Header() {
  return (
    <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* LOGO + TAG DE IA */}
          <Link href="/" className="flex items-center gap-1 group">
            
            {/* 1. NOME FORTE (Usa font-black para peso máximo) */}
            <span className="text-2xl font-black tracking-tighter text-slate-900 group-hover:opacity-80 transition-opacity">
              IMOVIT
            </span>

            {/* 2. TAG "POWERED AI" (O ícone que representa a IA) */}
            <div className="flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full bg-slate-900 text-white border border-slate-700 shadow-sm transform group-hover:scale-105 transition-all">
               <Sparkles size={10} className="text-brand-400" fill="currentColor" />
               <span className="text-[9px] font-bold tracking-widest uppercase text-slate-100">
                 AI
               </span>
            </div>

          </Link>

          {/* LADO DIREITO: ÁREA DO PARCEIRO */}
          <Link 
            href="/platform/admin" 
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500 hover:text-brand-600 transition-colors bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-full"
          >
            <UserCircle size={16} />
            <span className="hidden sm:inline">Área do Parceiro</span>
          </Link>

        </div>
      </div>
    </header>
  )
}
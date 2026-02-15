import { TrendingUp } from 'lucide-react'

export function HeroBanner() {
  return (
    <div className="relative w-full h-[220px] overflow-hidden bg-blue-950 flex items-center justify-center">
      
      {/* Imagem de fundo com opacidade ajustada */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop")',
        }}
      ></div>
      
      {/* Overlay Gradiente para suavizar */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/80 to-blue-900/40"></div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tighter">
          IMOVIT AI
        </h1>
        
        <p className="text-sm md:text-base text-blue-100 font-medium leading-relaxed max-w-2xl mx-auto opacity-90">
          Agente de IA para <strong className="text-white">Corretor</strong> • 
          Agente de IA para <strong className="text-white">Vendas</strong> • 
          Agente de IA para <strong className="text-white">Mercado</strong>
        </p>
        
        {/* Badge Minimalista Clean */}
        <div className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
          <TrendingUp size={14} className="text-white" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">
            Data Driven Analytics
          </span>
        </div>
      </div>
    </div>
  )
}
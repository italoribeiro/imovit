import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { 
  BrainCircuit, 
  TrendingUp, 
  Users2, 
  DollarSign, 
  ArrowUpRight, 
} from 'lucide-react'
import Link from 'next/link'
import { DashboardCharts } from '@/components/admin/dashboard-stats'

export default async function AdminDashboard() {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  // 1. BUSCA DE DADOS AMPLIADA
  // Agora buscamos também os detalhes do imóvel para alimentar os gráficos
  const { data: proposals } = await supabase
    .from('proposals')
    .select(`
      total_offer, 
      status, 
      properties (
        type,
        neighborhood,
        city
      )
    `)

  const safeProposals = proposals || []
  
  // --- CÁLCULOS DOS KPIs ---
  const totalLeads = safeProposals.length
  const pipelineAtivo = safeProposals.reduce((acc, curr) => acc + (Number(curr.total_offer) || 0), 0)
  const ticketMedio = totalLeads > 0 ? pipelineAtivo / totalLeads : 0
  const taxaConversao = totalLeads > 0 
    ? (safeProposals.filter(p => p.status === 'vendido').length / totalLeads) * 100 
    : 0

  // --- PROCESSAMENTO PARA OS GRÁFICOS ---
  // Agrupando dados para os indicadores que você pediu
  const typeCounts: Record<string, number> = {}
  const locationCounts: Record<string, number> = {}

  safeProposals.forEach(p => {
    // @ts-ignore - propriedades do join
    const type = p.properties?.type || 'Não Informado'
    // @ts-ignore - propriedades do join
    const loc = p.properties?.neighborhood || p.properties?.city || 'Outros'
    
    typeCounts[type] = (typeCounts[type] || 0) + 1
    locationCounts[loc] = (locationCounts[loc] || 0) + 1
  })

  const typeData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }))
  const locationData = Object.entries(locationCounts).map(([name, value]) => ({ name, value }))

  const stats = [
    { label: 'Total de Leads', value: totalLeads.toString(), icon: Users2, trend: '+12%', color: 'text-blue-600' },
    { label: 'Pipeline Ativo', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pipelineAtivo), icon: TrendingUp, trend: '+5%', color: 'text-emerald-600' },
    { label: 'Ticket Médio', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ticketMedio), icon: DollarSign, trend: '-2%', color: 'text-amber-600' },
    { label: 'Taxa de Conversão', value: `${taxaConversao.toFixed(1)}%`, icon: ArrowUpRight, trend: '+0.5%', color: 'text-brand-600' },
  ]

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER COM BOTÃO FUNCIONAL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight text-brand-600">Dashboard</h1>
          <p className="text-slate-500 font-medium text-sm">Gestão inteligente de propostas e performance.</p>
        </div>
        
        {/* Agora o botão é um Link que leva para a análise global */}
        <Link 
          href="/platform/admin/analysis/global"
          className="flex items-center gap-3 bg-slate-900 hover:bg-brand-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-2xl group"
        >
          <BrainCircuit className="text-brand-400 group-hover:text-white group-hover:rotate-12 transition-all" size={24} />
          DIAGNÓSTICO DA IA
        </Link>
      </div>

      {/* CARDS DE KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 bg-slate-50 rounded-2xl ${s.color} group-hover:scale-110 transition-transform`}>
                <s.icon size={26} />
              </div>
              <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase tracking-tighter">Live Data</span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{s.value}</h3>
          </div>
        ))}
      </div>

      {/* SEÇÃO DE GRÁFICOS DINÂMICOS */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-brand-500 rounded-full" />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Análise de Demanda</h2>
        </div>
        <DashboardCharts typeData={typeData} locationData={locationData} />
      </div>

    </div>
  )
}
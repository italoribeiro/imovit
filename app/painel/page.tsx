'use client'

import { PlusCircle, Eye, MousePointer2, MessageSquare, Check, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function PainelDashboard() {
  
  // No futuro, esses dados virão de um SELECT count(*) na tabela properties e leads_log
  const stats = [
    { name: 'Visualizações', value: '0', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Cliques no Link', value: '0', icon: MousePointer2, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Contatos Direct', value: '0', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  const planos = [
    { 
      name: 'Essencial', 
      price: 'Grátis', 
      desc: 'Ideal para proprietários diretos.', 
      current: true, 
      features: ['1 Imóvel ativo', 'Exposição padrão', 'Validade de 90 dias', 'Fotos ilimitadas'] 
    },
    { 
      name: 'Impulso PRO', 
      price: 'R$ 89', 
      desc: 'Para quem quer vender rápido.', 
      current: false, 
      features: ['3 Imóveis ativos', 'Destaque nas buscas', 'Anúncio no Instagram', 'IA de análise de fotos'] 
    },
    { 
  name: 'Dominante', 
  price: 'R$ 199', 
  desc: 'O plano das imobiliárias.', 
  current: false, 
  features: [
    'Imóveis ilimitados', 
    'Selo Corretor Premium', // Passa mais autoridade no site
    'Data Analytics Avançado', // Gráficos de performance real
    'Assistente de IA (24h)', // IA que responde leads e cria anúncios
    'Prioridade Máxima nos Leads',
    'Suporte VIP via WhatsApp'
  ] 
},
  ]

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700 pb-20">
      
      {/* Cabeçalho de Boas-vindas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Painel de Controle</h1>
          <p className="text-slate-500 mt-1 font-medium">Gerencie seus anúncios e acompanhe o interesse dos compradores.</p>
        </div>
        <Link 
          href="/painel/novo-imovel"
          className="mt-6 sm:mt-0 inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-8 rounded-2xl transition-all shadow-lg shadow-brand-500/25 active:scale-95"
        >
          <PlusCircle size={20} />
          Anunciar Imóvel
        </Link>
      </div>

      {/* Cards de Métricas (A Inteligência do Negócio) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center text-slate-400 text-xs font-bold">
                <TrendingUp size={14} className="mr-1" /> 0%
              </div>
            </div>
            <p className="text-4xl font-black text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-1">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Listagem de Imóveis (Estado Vazio) */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Meus Anúncios Recentes</h2>
          <Link href="/painel/meus-anuncios" className="text-sm font-bold text-brand-600 hover:underline">Ver todos</Link>
        </div>
        
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center">
          <div className="mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <PlusCircle className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhum imóvel cadastrado</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
            Você ainda não tem imóveis ativos. Comece a povoar sua prateleira e use nossa inteligência para vender.
          </p>
          <Link 
            href="/painel/novo-imovel"
            className="text-brand-600 font-black text-lg hover:text-brand-800 transition-colors"
          >
            Cadastrar meu primeiro imóvel &rarr;
          </Link>
        </div>
      </div>

      {/* Seção de Planos (Ancoragem e Up-sell) */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 sm:p-16 relative overflow-hidden">
        {/* Detalhe estético no fundo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-3xl font-black text-white mb-4">Turbine seus resultados 🚀</h2>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto">
            Escolha o plano que melhor se adapta à sua necessidade e tenha o dobro de interessados no seu WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {planos.map((plano) => (
            <div 
              key={plano.name} 
              className={`bg-white/5 backdrop-blur-sm border-2 rounded-[2rem] p-8 transition-all ${
                plano.current ? 'border-brand-500' : 'border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              {plano.current && (
                <div className="inline-flex items-center gap-1 bg-brand-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full mb-4">
                  <Check size={12} /> Plano Ativo
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-1">{plano.name}</h3>
              <p className="text-slate-400 text-sm mb-6 font-medium">{plano.desc}</p>
              
              <div className="text-3xl font-black text-white mb-8">
                {plano.price} <span className="text-sm font-medium text-slate-500">/mês</span>
              </div>

              <ul className="space-y-4 mb-10">
                {plano.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                    <div className="bg-brand-500/20 text-brand-500 p-1 rounded-full">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <button 
                disabled 
                className={`w-full py-4 rounded-2xl font-bold transition-all ${
                  plano.current 
                  ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                  : 'bg-brand-600 text-white cursor-not-allowed'
                }`}
              >
                {plano.current ? 'Seu Plano Atual' : 'Em breve'}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
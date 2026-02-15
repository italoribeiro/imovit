import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ProposalFilters } from '@/components/admin/proposal-filters'
import { StatusSelect } from '@/components/admin/status-select'
import { ExportButton } from '@/components/admin/export-button'
import { BrainCircuit, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { DiagnosisButton } from '@/components/admin/diagnosis-button'

export default async function ProposalsCRM({ searchParams }: any) {
  const cookieStore = await cookies()
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const pageSize = 10

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  let query = supabase.from('proposals').select('*, properties(title, sale_price, type)', { count: 'exact' })
  
  if (params.status) query = query.eq('status', params.status)
  if (params.search) query = query.ilike('client_name', `%${params.search}%`)
  if (params.start) query = query.gte('created_at', params.start)
  if (params.end) query = query.lte('created_at', params.end)

  const { data, count } = await query
    .order('created_at', { ascending: false })
    .range((currentPage - 1) * pageSize, currentPage * pageSize - 1)

  const proposals = data || []
  const totalPages = Math.ceil((count || 0) / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Leads</h1>
          <p className="text-slate-500 font-medium text-sm italic">Controle total de negociações (Total: {count} registros)</p>
        </div>
        <ExportButton data={proposals} />
      </div>

      <ProposalFilters />

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full text-left border-collapse min-w-[1500px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 w-[120px]">Data</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 min-w-[200px]">Cliente</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">E-mail</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Telefone</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 min-w-[300px]">Imóvel (Título)</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 text-center w-[100px]">Tipo</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 w-[150px]">Preço Base</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 w-[150px]">Proposta</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 text-center w-[100px]">IA Score</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 text-center w-[160px]">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-[100px]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {proposals.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5 text-[11px] text-slate-400 font-bold border-r border-slate-50 whitespace-nowrap">
                    {new Date(p.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-5 font-black text-slate-900 uppercase border-r border-slate-50 whitespace-nowrap">
                    {p.client_name}
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500 font-bold border-r border-slate-50 whitespace-nowrap">
                    {p.client_email}
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500 font-bold border-r border-slate-50 whitespace-nowrap">
                    {p.client_phone}
                  </td>
                  {/* Coluna do Imóvel com largura fixa para não sumir o título */}
                  <td className="px-6 py-5 font-bold text-slate-700 border-r border-slate-50 min-w-[350px]">
                    {p.properties?.title}
                  </td>
                  <td className="px-6 py-5 text-center border-r border-slate-50">
                    <span className="text-[9px] font-black bg-slate-100 px-2 py-1 rounded-lg uppercase">
                      {p.properties?.type}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-slate-400 font-bold border-r border-slate-50 whitespace-nowrap">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.properties?.sale_price || 0)}
                  </td>
                  <td className="px-6 py-5 border-r border-slate-50 font-black text-brand-600 whitespace-nowrap">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.total_offer)}
                  </td>
                  <td className="px-6 py-5 text-center border-r border-slate-50">
                    <div className="inline-flex w-10 h-10 items-center justify-center rounded-xl bg-slate-50 text-xs font-black border border-slate-100">
                      {p.ai_score || '--'}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center border-r border-slate-50">
                    <StatusSelect id={p.id} currentStatus={p.status} />
                  </td>
                  <td className="px-6 py-5 text-center">
                    {/* USO DO NOVO BOTÃO COM LOADING */}
                    <DiagnosisButton id={p.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO REINSERIDA */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Página {currentPage} de {totalPages}</span>
          <div className="flex gap-2">
            <Link href={`?page=${Math.max(1, currentPage - 1)}`} className={`p-3 bg-white border border-slate-200 rounded-2xl ${currentPage === 1 ? 'opacity-30 pointer-events-none' : 'hover:bg-slate-100'}`}><ChevronLeft size={20} /></Link>
            <Link href={`?page=${Math.min(totalPages, currentPage + 1)}`} className={`p-3 bg-white border border-slate-200 rounded-2xl ${currentPage === totalPages ? 'opacity-30 pointer-events-none' : 'hover:bg-slate-100'}`}><ChevronRight size={20} /></Link>
          </div>
        </div>
      </div>
    </div>
  )
}
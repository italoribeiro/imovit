'use client'
import { Search, Calendar } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

export function ProposalFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  function handleFilter(name: string, value: string) {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(name, value)
    else params.delete(name)
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-5 gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-6 ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="relative lg:col-span-2">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Buscar cliente ou imóvel..." 
          onChange={(e) => handleFilter('search', e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none"
        />
      </div>
      <select 
        onChange={(e) => handleFilter('status', e.target.value)}
        className="bg-slate-50 border-none rounded-2xl text-sm px-4 py-3 outline-none font-bold text-slate-600"
      >
        <option value="">Status: Todos</option>
        <option value="novo">Novo Lead</option>
        <option value="negociando">Negociando</option>
        <option value="vendido">Vendido</option>
      </select>
      <input 
        type="date" 
        title="Data Inicial"
        onChange={(e) => handleFilter('start', e.target.value)}
        className="bg-slate-50 border-none rounded-2xl text-sm px-4 py-3 outline-none font-bold text-slate-400"
      />
      <input 
        type="date" 
        title="Data Final"
        onChange={(e) => handleFilter('end', e.target.value)}
        className="bg-slate-50 border-none rounded-2xl text-sm px-4 py-3 outline-none font-bold text-slate-400"
      />
    </div>
  )
}
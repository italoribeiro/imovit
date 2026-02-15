'use client'
import { useState } from 'react'
import { updateProposalStatus } from '@/app/actions/proposals'
import { Loader2 } from 'lucide-react'

export function StatusSelect({ id, currentStatus }: { id: number, currentStatus: string }) {
  const [loading, setLoading] = useState(false)

  async function handleChange(newStatus: string) {
    setLoading(true)
    await updateProposalStatus(id, newStatus)
    setLoading(false)
  }

  return (
    <div className="relative inline-flex items-center">
      <select 
        disabled={loading}
        defaultValue={currentStatus}
        onChange={(e) => handleChange(e.target.value)}
        className={`appearance-none bg-slate-900 text-white text-[10px] font-black uppercase px-6 py-2.5 rounded-xl outline-none border-none cursor-pointer hover:bg-brand-600 transition-all min-w-[130px] text-center ${loading ? 'opacity-50' : ''}`}
      >
        <option value="novo">Novo Lead</option>
        <option value="negociando">Negociando</option>
        <option value="vendido">Vendido</option>
      </select>
      {loading && <Loader2 className="absolute right-2 animate-spin text-brand-400" size={14} />}
    </div>
  )
}
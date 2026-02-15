'use client'

import { useState } from 'react'
import { submitProposal } from '@/app/actions'
import { MessageCircle, Bot } from 'lucide-react'

interface ProposalFormProps {
  propertyId: number
  propertyTitle: string
  neighborhood: string 
  intent: 'venda' | 'aluguel' | 'ambos'
}

export function ProposalForm({ propertyId, propertyTitle,neighborhood, intent }: ProposalFormProps) {
  const [value, setValue] = useState('')
  const [sent, setSent] = useState(false)
// Agora você pode usar o neighborhood na mensagem padrão sem erro!
  const defaultMessage = `Olá, tenho interesse no imóvel "${propertyTitle}" em ${neighborhood}. Aguardo contato.`
  const buttonLabel = intent === 'venda' ? 'ENVIAR PROPOSTA DE COMPRA' : 'ENVIAR PROPOSTA DE ALUGUEL'

  const formatCurrency = (val: string) => {
    const digits = val.replace(/\D/g, '')
    return (Number(digits) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
  }

  if (sent) return (
    <div className="p-8 bg-green-50 text-green-800 rounded-2xl border border-green-200 text-center">
      <h3 className="font-bold">Proposta enviada!</h3>
      <p className="text-sm">O anunciante entrará em contato em breve.</p>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6 font-display tracking-tight">Falar com o anunciante</h2>
        <form action={async (fd) => { await submitProposal(fd); setSent(true); }} className="space-y-4">
          <input type="hidden" name="propertyId" value={propertyId} />
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nome</label>
            <input required name="name" type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500" placeholder="Nome completo" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">E-mail</label>
              <input required name="email" type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500" placeholder="exemplo@email.com" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Telefone</label>
              <input required name="phone" type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500" placeholder="(85) 99999-9999" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mensagem</label>
            <textarea name="message" rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none resize-none text-sm text-slate-600" 
              defaultValue={`Olá, tenho interesse no imóvel "${propertyTitle}". Aguardo contato.`} 
            />
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Valor da sua Oferta (R$)</label>
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-400 text-lg">R$</span>
              <input required name="totalOffer" value={value} onChange={(e) => setValue(formatCurrency(e.target.value))} className="bg-transparent font-bold text-2xl text-slate-800 outline-none w-full" placeholder="0,00" />
            </div>
          </div>
          <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-brand-500/20">
            {buttonLabel}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <a href="#" className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity">
          <MessageCircle size={20} /> WHATSAPP
        </a>
        <button className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white font-bold py-4 rounded-2xl hover:bg-slate-900 transition-all">
          <Bot size={20} /> FALE COM NOSSO CORRETOR IA
        </button>
      </div>
    </div>
  )
}
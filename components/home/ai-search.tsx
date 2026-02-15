'use client'

import { Sparkles, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export function AISearch() {
  const [prompt, setPrompt] = useState('')

  const suggestions = [
    { label: "Sou corretor, quero vender meus imóveis 🏢", text: "Sou corretor parceiro e gostaria de cadastrar minha carteira..." },
    { label: "Apê em Messejana com Pet 🐕", text: "Quero um apartamento em Messejana que permite pet..." },
    { label: "Investimento na CE-040 📈", text: "Qual a tendência de valorização para terrenos na CE-040?" },
  ]

  return (
    // Removidos os wrappers externos. Agora é só o card.
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 md:p-4">
      {/* Header do Chat */}
      <div className="flex items-center gap-2 px-1 py-2 mb-2">
        <Sparkles className="text-brand-500" size={16} />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Encontre o imóvel dos sonhos com nossa IA
        </span>
      </div>

      {/* Input */}
      <div className="relative group">
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Digite aqui... Ex: Quero uma casa de 3 quartos perto de escolas..."
          className="w-full h-[80px] bg-slate-50 rounded-xl p-4 text-sm text-slate-700 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-100 resize-none transition-all"
        />
        <button className="absolute bottom-3 right-3 bg-slate-900 text-white p-2 rounded-lg hover:bg-brand-600 transition-all">
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Chips de Sugestão */}
      <div className="flex flex-wrap gap-2 mt-4">
        {suggestions.map((s, i) => (
          <button 
            key={i}
            onClick={() => setPrompt(s.text)}
            className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-all text-left"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
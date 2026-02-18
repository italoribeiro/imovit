'use client'

import { useFormStatus } from 'react-dom'
import { Loader2, Save } from 'lucide-react'

interface SubmitButtonProps {
  text?: string
  loadingText?: string
}

export function SubmitButton({ text = 'Salvar', loadingText = 'Salvando...' }: SubmitButtonProps) {
  // Esse hook mágico sabe se o form pai está enviando dados
  const { pending } = useFormStatus()

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-500 transition-all shadow-lg flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          <Save size={20} />
          {text}
        </>
      )}
    </button>
  )
}
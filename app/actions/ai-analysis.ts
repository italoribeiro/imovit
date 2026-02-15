'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function analyzeProposal(proposalId: number) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  const API_KEY = process.env.GEMINI_API_KEY
  // 1. Usando EXATAMENTE o modelo e versão do seu script funcional
  const MODELO = "gemini-flash-latest" 
  const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent?key=${API_KEY}`

  const { data: proposal } = await supabase
    .from('proposals')
    .select('*, properties(*)')
    .eq('id', proposalId)
    .single()

  if (!proposal) return { error: 'Proposta não encontrada.' }

  const promptText = `Analise como Diretor Imobiliário: Imóvel ${proposal.properties.title}, Valor R$ ${proposal.properties.sale_price || proposal.properties.price}, Oferta R$ ${proposal.total_offer}. Retorne APENAS JSON puro: {"score": 0-100, "diagnostic": "...", "strategy": "..."}`

  const payload = { 
    "contents": [{ 
      "parts": [{ "text": promptText }] 
    }] 
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    // 2. Mesma lógica de verificação de candidatos do seu script
    if (data.candidates && data.candidates.length > 0) {
      const responseText = data.candidates[0].content.parts[0].text
      const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim()
      const analysis = JSON.parse(cleanJson)

      // 3. Grava no banco
      await supabase
        .from('proposals')
        .update({ 
          ai_analysis: analysis.diagnostic, 
          ai_score: analysis.score 
        })
        .eq('id', proposalId)

      return analysis
    } else {
      console.error("Gemini Response Error:", data)
      throw new Error(data.error?.message || "IA não retornou dados.")
    }

  } catch (err: any) {
    console.error("Falha na Server Action:", err.message)
    return { 
      error: 'Erro na análise',
      diagnostic: `O Google respondeu: ${err.message}`,
      strategy: 'Tente novamente. O modelo flash-latest pode estar instável.'
    }
  }
}
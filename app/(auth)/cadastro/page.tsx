//Cadastro do Anunciante

'use column'
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, ArrowRight, ArrowLeft, User, Building, Briefcase, Loader2, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function CadastroWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // O "Cérebro" do formulário guardando as respostas
  const [formData, setFormData] = useState({
    entity_type: '',
    category: '',
    full_name: '',
    phone: '',
    document_number: '',
    creci_number: '',
    email: '',
    password: ''
  })

  // Função para avançar/voltar as "telas" do Chatbot
  const nextStep = () => {
    setError('')
    setStep((prev) => prev + 1)
  }
  const prevStep = () => {
    setError('')
    setStep((prev) => prev - 1)
  }

  // A Mágica: Salvar no Supabase (Auth + Perfil)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Cria a conta de acesso no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error('Erro ao criar usuário.')
      }

      // 2. Salva os dados de negócio na nossa tabela advertiser_profiles
      const { error: profileError } = await supabase
        .from('advertiser_profiles')
        .insert({
          id: authData.user.id, // O elo de ligação!
          entity_type: formData.entity_type,
          category: formData.category,
          full_name: formData.full_name,
          phone: formData.phone,
          document_number: formData.document_number,
          creci_number: formData.creci_number || null,
          email: formData.email,
          plan_id: 'free' // Começa no plano gratuito do MVP
        })

      if (profileError) {
        console.error("Erro no perfil:", profileError)
        throw new Error('Conta criada, mas houve um erro ao salvar o perfil. Contate o suporte.')
      }

      // Tudo certo! Manda pro painel
      router.push('/painel')

    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Cabeçalho Fixo */}
        <div className="flex justify-center text-brand-600 mb-6">
          <Home size={40} strokeWidth={2.5} />
        </div>
        
        {/* Barra de Progresso Inteligente */}
        <div className="mb-8 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
             <div key={s} className={`h-2 w-12 rounded-full transition-colors duration-300 ${step >= s ? 'bg-brand-600' : 'bg-slate-200'}`} />
          ))}
        </div>

        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100 relative overflow-hidden">
          
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold text-center">
              {error}
            </div>
          )}

          {/* PASSO 1: A Bifurcação Principal */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-black text-slate-900 mb-2 text-center">O que traz você ao Imovit AI?</h2>
              <p className="text-slate-500 text-center mb-8 text-sm">Escolha o seu perfil para personalizarmos sua experiência.</p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => {
                    setFormData({ ...formData, entity_type: 'PF', category: 'proprietario' })
                    setStep(3) // Pula o passo 2 porque já sabemos o que ele é!
                  }}
                  className="w-full flex items-center p-4 border-2 border-slate-100 rounded-2xl hover:border-brand-500 hover:bg-brand-50 transition-all text-left group"
                >
                  <div className="bg-slate-100 group-hover:bg-white p-3 rounded-xl text-slate-600 group-hover:text-brand-600 transition-colors">
                    <User size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-slate-900">Sou Proprietário</h3>
                    <p className="text-sm text-slate-500">Quero anunciar meu próprio imóvel.</p>
                  </div>
                </button>

                <button 
                  onClick={() => setStep(2)}
                  className="w-full flex items-center p-4 border-2 border-slate-100 rounded-2xl hover:border-brand-500 hover:bg-brand-50 transition-all text-left group"
                >
                  <div className="bg-slate-100 group-hover:bg-white p-3 rounded-xl text-slate-600 group-hover:text-brand-600 transition-colors">
                    <Briefcase size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-slate-900">Sou Profissional</h3>
                    <p className="text-sm text-slate-500">Corretor, imobiliária ou construtora.</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* PASSO 2: Subcategoria do Profissional */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <button onClick={prevStep} className="text-slate-400 hover:text-slate-600 mb-4 flex items-center text-sm font-semibold">
                <ArrowLeft size={16} className="mr-1"/> Voltar
              </button>
              <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">Como você atua no mercado?</h2>
              
              <div className="space-y-3">
                <button 
                  onClick={() => { setFormData({ ...formData, entity_type: 'PF', category: 'corretor' }); nextStep(); }}
                  className="w-full py-4 px-6 font-bold text-slate-700 border-2 border-slate-100 rounded-2xl hover:border-brand-500 hover:text-brand-600 transition-all text-left"
                >
                  Corretor Autônomo (CRECI Física)
                </button>
                <button 
                  onClick={() => { setFormData({ ...formData, entity_type: 'PJ', category: 'imobiliaria' }); nextStep(); }}
                  className="w-full py-4 px-6 font-bold text-slate-700 border-2 border-slate-100 rounded-2xl hover:border-brand-500 hover:text-brand-600 transition-all text-left"
                >
                  Imobiliária (CRECI Jurídica)
                </button>
                <button 
                  onClick={() => { setFormData({ ...formData, entity_type: 'PJ', category: 'construtora' }); nextStep(); }}
                  className="w-full py-4 px-6 font-bold text-slate-700 border-2 border-slate-100 rounded-2xl hover:border-brand-500 hover:text-brand-600 transition-all text-left"
                >
                  Construtora / Incorporadora
                </button>
              </div>
            </div>
          )}

          {/* PASSO 3: Dados Básicos */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <button onClick={() => setStep(formData.category === 'proprietario' ? 1 : 2)} className="text-slate-400 hover:text-slate-600 mb-4 flex items-center text-sm font-semibold">
                <ArrowLeft size={16} className="mr-1"/> Voltar
              </button>
              <h2 className="text-2xl font-black text-slate-900 mb-2 text-center">Prazer em te conhecer!</h2>
              <p className="text-slate-500 text-center mb-6 text-sm">Como os clientes vão chamar você?</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    {formData.entity_type === 'PJ' ? 'Razão Social ou Nome da Empresa' : 'Seu Nome Completo'}
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder={formData.entity_type === 'PJ' ? 'Imobiliária Morar Bem Ltda' : 'João da Silva'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <button 
                  onClick={nextStep}
                  disabled={!formData.full_name || !formData.phone}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl mt-4 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                >
                  Continuar <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* PASSO 4: Documentos */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <button onClick={prevStep} className="text-slate-400 hover:text-slate-600 mb-4 flex items-center text-sm font-semibold">
                <ArrowLeft size={16} className="mr-1"/> Voltar
              </button>
              <h2 className="text-2xl font-black text-slate-900 mb-2 text-center">Segurança da Plataforma</h2>
              <p className="text-slate-500 text-center mb-6 text-sm">Apenas para garantir que você é uma pessoa real e evitar fraudes.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    {formData.entity_type === 'PJ' ? 'CNPJ' : 'CPF'}
                  </label>
                  <input
                    type="text"
                    value={formData.document_number}
                    onChange={(e) => setFormData({ ...formData, document_number: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder={formData.entity_type === 'PJ' ? '00.000.000/0001-00' : '000.000.000-00'}
                  />
                </div>

                {/* Exige CRECI apenas para corretores e imobiliárias */}
                {(formData.category === 'corretor' || formData.category === 'imobiliaria') && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Número do CRECI (Obrigatório)</label>
                    <input
                      type="text"
                      value={formData.creci_number}
                      onChange={(e) => setFormData({ ...formData, creci_number: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                      placeholder={formData.category === 'corretor' ? 'Ex: 12345-F' : 'Ex: 9999-J'}
                    />
                  </div>
                )}

                <button 
                  onClick={nextStep}
                  disabled={!formData.document_number || ((formData.category === 'corretor' || formData.category === 'imobiliaria') && !formData.creci_number)}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl mt-4 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                >
                  Continuar <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* PASSO 5: Login e Criação */}
          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <button onClick={prevStep} className="text-slate-400 hover:text-slate-600 mb-4 flex items-center text-sm font-semibold">
                <ArrowLeft size={16} className="mr-1"/> Voltar
              </button>
              <h2 className="text-2xl font-black text-slate-900 mb-2 text-center">Último passo!</h2>
              <p className="text-slate-500 text-center mb-6 text-sm">Crie seu e-mail e senha para acessar o painel.</p>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="voce@exemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Senha</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="Mínimo de 6 caracteres"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading || !formData.email || !formData.password}
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-xl mt-6 disabled:opacity-50 shadow-lg shadow-brand-500/30 transition-all flex justify-center items-center gap-2"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><CheckCircle2 size={20} /> Concluir Cadastro</>}
                </button>
              </form>
            </div>
          )}

        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-bold text-brand-600 hover:text-brand-800 underline transition-colors">
            Faça login aqui.
          </Link>
        </p>

      </div>
    </div>
  )
}
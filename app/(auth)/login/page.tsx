//Login Anunciante - Página de Login para Anunciantes
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Home, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase' // Verifique se esse caminho está correto no seu projeto

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        router.push('/painel')
      }
    } catch (err: any) {
      setError('E-mail ou senha incorretos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-white font-sans">
      
      {/* LADO ESQUERDO: Formulário (Visível em todas as telas) */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12 xl:w-5/12">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          
          {/* Cabeçalho / Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 text-brand-600 mb-6">
              <Home size={32} strokeWidth={2.5} />
              <span className="text-2xl font-black tracking-tight text-slate-900">Imovit AI</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Acesse ou crie sua conta
            </h2>
          </div>

          {/* Botão do Google (Apenas UI por enquanto) */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 font-bold py-3.5 px-4 rounded-full hover:bg-slate-50 transition-colors shadow-sm mb-6"
            onClick={() => alert('Integração com Google será implementada na Fase 2!')}
          >
            {/* Ícone SVG nativo do Google */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Entrar com Google
          </button>

          {/* Divisor "ou" */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm font-medium">
              <span className="bg-white px-4 text-slate-500">ou</span>
            </div>
          </div>

          {/* Formulário de E-mail/Senha */}
          <form className="space-y-4" onSubmit={handleLogin}>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold text-center mb-4">
                {error}
              </div>
            )}

            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-5 py-3.5 bg-white border border-slate-300 rounded-full text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all"
                placeholder="E-mail cadastrado"
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-5 py-3.5 bg-white border border-slate-300 rounded-full text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all"
                placeholder="Senha cadastrada"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 transition-all mt-6"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Entrar'}
            </button>
          </form>

          {/* Links e Rodapé */}
          <div className="mt-6 flex flex-col items-center space-y-4">
            <a href="#" className="text-sm font-bold text-brand-600 hover:text-brand-800 transition-colors">
              Esqueci a senha
            </a>
            
            <p className="text-sm text-slate-600">
              Não possui conta?{' '}
              <Link href="/cadastro" className="font-bold text-brand-600 hover:text-brand-800 underline transition-colors">
                Cadastre-se aqui.
              </Link>
            </p>

            <p className="text-xs text-slate-400 text-center mt-8">
              Ao continuar você aceita os{' '}
              <a href="#" className="underline hover:text-slate-600">Termos de uso</a> e{' '}
              <a href="#" className="underline hover:text-slate-600">Política de privacidade</a>.
            </p>
          </div>

        </div>
      </div>

      {/* LADO DIREITO: Imagem de Lifestyle (Escondido no Mobile) */}
      {/* LADO DIREITO: Imagem de Lifestyle (Escondido no Mobile) */}
      <div className="hidden lg:block lg:w-1/2 xl:w-7/12 relative bg-slate-100">
        <Image
          src="https://img.freepik.com/vetores-gratis/conceito-de-pesquisa-imobiliaria_23-2148671001.jpg?w=2000&t=st=1700000000~exp=1700003600~hmac=abcdef1234567890"
          alt="Pessoa mostrando a casa através do smartphone"
          fill
          priority
          className="object-cover"
        />
        {/* Camada sutil para escurecer a imagem e dar um tom premium se necessário */}
        <div className="absolute inset-0 bg-brand-900/10 mix-blend-multiply" />
      </div>

    </div>
  )
}
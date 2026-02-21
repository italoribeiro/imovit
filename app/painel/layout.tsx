'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, LayoutDashboard, Users, User, CreditCard, Menu, X, LogOut, Handshake } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const menuItems = [
    { name: 'Meus Anúncios', href: '/painel', icon: LayoutDashboard },
    { name: 'Compradores (Leads)', href: '/painel/compradores', icon: Users },
    { name: 'Parcerias', href: '/painel/parcerias', icon: Handshake },
    { name: 'Dados da Conta', href: '/painel/conta', icon: User },
    { name: 'Financeiro e Plano', href: '/painel/financeiro', icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <Home className="h-6 w-6 text-brand-500 mr-2" />
          <span className="text-xl font-black text-white">Imovit AI</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sair da conta
          </button>
        </div>
      </aside>

      {/* CABEÇALHO MOBILE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden bg-slate-900 h-16 flex items-center justify-between px-4 sm:px-6 shadow-md">
          <div className="flex items-center">
            <Home className="h-6 w-6 text-brand-500 mr-2" />
            <span className="text-xl font-black text-white">Imovit</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-300 hover:text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {/* MENU MOBILE EXPANDIDO */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-800 absolute top-16 inset-x-0 z-50 shadow-xl border-b border-slate-700">
            <nav className="px-2 pt-2 pb-4 space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-3 text-base font-medium rounded-md ${
                      isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="mr-4 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-3 text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white rounded-md mt-2"
              >
                <LogOut className="mr-4 h-5 w-5" />
                Sair
              </button>
            </nav>
          </div>
        )}

        {/* ÁREA DE CONTEÚDO PRINCIPAL */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none bg-slate-50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
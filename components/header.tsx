import Link from 'next/link'
import { Home, UserCircle } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="container-custom h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-brand-600 hover:opacity-80 transition-opacity">
          <div className="bg-brand-500 p-1.5 rounded-lg">
            <Home className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-brand-900">IMOVIT</span>
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-slate-600 hover:text-brand-600 font-medium text-sm">
            Comprar
          </Link>
          <Link href="/" className="text-slate-600 hover:text-brand-600 font-medium text-sm">
            Alugar
          </Link>
          <Link href="#" className="text-slate-600 hover:text-brand-600 font-medium text-sm">
            Anunciar
          </Link>
        </nav>

        {/* Botão Entrar (Futuro Login) */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-slate-700 hover:text-brand-600 font-medium text-sm px-4 py-2 rounded-full border border-slate-200 hover:border-brand-200 transition-colors">
            <UserCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Entrar</span>
          </button>
        </div>
      </div>
    </header>
  )
}
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
// Adicionei Building2 (Imóveis) e os Chevrons (Setinhas)
import { LayoutDashboard, ClipboardList, LogOut, Zap, Building2, ChevronLeft, ChevronRight } from 'lucide-react'

// Interface para definir o que este componente aceita receber
interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname()

  const menu = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/platform/admin' },
    // ADICIONEI O LINK PARA O MÓDULO DE IMÓVEIS QUE CRIAMOS
    { icon: Building2, label: 'Meus Imóveis', href: '/platform/admin/properties' },
    { icon: ClipboardList, label: 'Propostas (CRM)', href: '/platform/admin/proposals' },
  ]

  return (
    <aside 
      className={`bg-slate-900 h-screen sticky top-0 flex flex-col text-slate-400 border-r border-slate-800 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* CABEÇALHO + BOTÃO DE TOGGLE */}
      <div className={`flex items-center gap-3 relative transition-all ${isCollapsed ? 'p-4 justify-center' : 'p-8'}`}>
        <Zap className="text-brand-500 shrink-0" fill="currentColor" size={24} />
        
        {/* Texto do Logo (some se estiver fechado) */}
        <span className={`text-xl font-bold text-white uppercase tracking-tighter whitespace-nowrap overflow-hidden transition-all duration-300 ${
          isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
        }`}>
          Imovit Admin
        </span>

        {/* Botão de Abrir/Fechar (Posicionado na borda) */}
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-8 bg-brand-600 text-white p-1 rounded-full shadow-lg hover:bg-brand-500 border border-slate-900 z-50"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* MENU DE NAVEGAÇÃO */}
      <nav className="flex-1 px-3 space-y-2 mt-4">
        {menu.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link 
              key={item.label} 
              href={item.href} 
              title={isCollapsed ? item.label : ''} // Mostra tooltip nativo se fechado
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                isActive ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20' : 'hover:bg-slate-800'
              } ${isCollapsed ? 'justify-center' : ''}`} // Centraliza ícone se fechado
            >
              <item.icon size={20} className="shrink-0" />
              
              {/* Texto do Menu (some se estiver fechado) */}
              <span className={`text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'
              }`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* RODAPÉ (SAIR) */}
      <div className="p-4 border-t border-slate-800/50">
        <button className={`flex items-center gap-3 text-sm hover:text-white transition-colors w-full ${isCollapsed ? 'justify-center' : ''}`}>
          <LogOut size={18} className="shrink-0" /> 
          
          <span className={`whitespace-nowrap transition-all duration-300 ${
             isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'
          }`}>
            Sair
          </span>
        </button>
      </div>
    </aside>
  )
}
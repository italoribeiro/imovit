'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/admin/sidebar' // Ajuste o caminho se sua pasta for diferente

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Estado que controla se o menu está recolhido (true) ou expandido (false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Sidebar recebendo o controle */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
      />
      
      {/* Área de Conteúdo Dinâmico */}
      {/* O flex-1 garante que ele ocupe todo o espaço restante automaticamente */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  )
}
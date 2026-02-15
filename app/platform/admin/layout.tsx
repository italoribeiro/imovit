import { Sidebar } from '@/components/admin/sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Menu Fixo */}
      <Sidebar />
      
      {/* Área de Conteúdo Dinâmico */}
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
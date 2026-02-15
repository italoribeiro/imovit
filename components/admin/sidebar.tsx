'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardList, LogOut, Zap, BrainCircuit } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const menu = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/platform/admin' },
    { icon: ClipboardList, label: 'Propostas (CRM)', href: '/platform/admin/proposals' },
  ]

  return (
    <aside className="w-64 bg-slate-900 h-screen sticky top-0 flex flex-col text-slate-400 border-r border-slate-800">
      <div className="p-8 flex items-center gap-3">
        <Zap className="text-brand-500" fill="currentColor" />
        <span className="text-xl font-bold text-white uppercase tracking-tighter">Imovit Admin</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menu.map((item) => (
          <Link key={item.label} href={item.href} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname === item.href ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'
            }`}>
            <item.icon size={20} />
            <span className="text-sm font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6">
        <button className="flex items-center gap-3 text-sm hover:text-white transition-colors">
          <LogOut size={18} /> Sair
        </button>
      </div>
    </aside>
  )
}
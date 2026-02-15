'use client'
import { FileSpreadsheet } from 'lucide-react'

export function ExportButton({ data }: { data: any[] }) {
  function downloadCSV() {
    const headers = ['Data', 'Cliente', 'Email', 'Telefone', 'Imovel', 'Valor Imovel', 'Proposta', 'Status']
    const rows = data.map(p => [
      new Date(p.created_at).toLocaleDateString('pt-BR'),
      p.client_name,
      p.client_email,
      p.client_phone,
      p.properties?.title,
      p.properties?.sale_price,
      p.total_offer,
      p.status
    ])

    const csvContent = [headers, ...rows].map(e => e.join(";")).join("\n")
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "leads_imovit.csv")
    link.click()
  }

  return (
    <button 
      onClick={downloadCSV}
      className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-100"
    >
      <FileSpreadsheet size={18} /> Exportar Excel
    </button>
  )
}
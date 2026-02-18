import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Plus, Pencil, Trash2, MapPin, BedDouble, Bath, Car } from 'lucide-react'
import { deleteProperty } from '@/app/actions/properties'

export const dynamic = 'force-dynamic'

export default async function PropertiesPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  // Busca os imóveis ordenados pelos mais recentes
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* CABEÇALHO DA PÁGINA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meus Imóveis</h1>
          <p className="text-slate-500">Gerencie seu portfólio de vendas e locação.</p>
        </div>
        <Link 
          href="/platform/admin/properties/new" 
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-600 transition-colors"
        >
          <Plus size={18} />
          Novo Imóvel
        </Link>
      </div>

      {/* LISTAGEM (GRID DE CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties?.map((property) => (
          <div key={property.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
            
            {/* Imagem do Imóvel - Lendo APENAS do Array images */}
            <div className="h-48 bg-slate-100 relative">
              {property.images && property.images.length > 0 ? (
                <img 
                  src={property.images[0]} // Pega sempre a primeira foto do array
                  alt={property.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-xs font-bold uppercase tracking-widest">
                  Sem Foto
                </div>
              )}
              
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-black uppercase text-slate-900 shadow-sm">
                {property.type}
              </div>
            </div>
            {/* ------------------------------------------------------------------ */}

            {/* Detalhes */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 line-clamp-1">{property.title}</h3>
                <span className="text-sm font-black text-brand-600 whitespace-nowrap">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-slate-500 mb-4">
                <MapPin size={12} />
                <span className="truncate">{property.neighborhood} • {property.city}</span>
              </div>

              {/* Ícones de Características */}
              <div className="flex gap-4 border-t border-slate-50 pt-3 mb-4">
                <div className="flex items-center gap-1 text-slate-400" title="Quartos">
                  <BedDouble size={14} /> <span className="text-xs font-bold">{property.bedrooms}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400" title="Banheiros">
                  <Bath size={14} /> <span className="text-xs font-bold">{property.bathrooms}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400" title="Vagas">
                  <Car size={14} /> <span className="text-xs font-bold">{property.garage}</span>
                </div>
              </div>

              {/* Ações (Editar / Excluir) */}
              <div className="flex gap-2">
                <Link 
                  href={`/platform/admin/properties/${property.id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-50 text-slate-600 py-2 rounded-lg text-xs font-bold hover:bg-brand-50 hover:text-brand-600 transition-colors"
                >
                  <Pencil size={14} /> Editar
                </Link>
                
                {/* Botão de Excluir (Server Action) */}
                <form action={deleteProperty.bind(null, property.id)}>
                   <button 
                    type="submit"
                    className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                    title="Excluir Imóvel"
                   >
                     <Trash2 size={14} />
                   </button>
                </form>
              </div>
            </div>
          </div>
        ))}

        {/* Estado Vazio */}
        {properties?.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-xl border border-dashed border-slate-300">
            <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus size={24} className="text-slate-400" />
            </div>
            <h3 className="text-slate-900 font-bold">Nenhum imóvel cadastrado</h3>
            <p className="text-slate-500 text-sm mb-4">Comece adicionando seu primeiro imóvel.</p>
            <Link 
              href="/platform/admin/properties/new" 
              className="text-brand-600 font-bold text-sm hover:underline"
            >
              Cadastrar agora &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
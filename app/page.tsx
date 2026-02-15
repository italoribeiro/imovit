import { supabase } from '@/lib/supabase'
import { Header } from '@/components/header'
import { PropertyCard } from '@/components/property-card'

// Desabilita cache para sempre pegar dados novos (importante para MVP)
export const dynamic = 'force-dynamic'

async function getProperties() {
  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar imóveis:', error)
    return []
  }

  return properties || []
}

export default async function Home() {
  const properties = await getProperties()

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Imóveis recentes
            </h1>
            <p className="text-slate-500">
              Encontre o lugar perfeito para você morar.
            </p>
          </div>
        </div>

        {/* Lista de Cards */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500">Nenhum imóvel encontrado no momento.</p>
          </div>
        )}
      </main>
    </div>
  )
}
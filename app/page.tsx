import { supabase } from '@/lib/supabase'
import { Header } from '@/components/header'
import { PropertyCard } from '@/components/property-card'
import { HeroBanner } from '@/components/home/hero-banner'
import { AISearch } from '@/components/home/ai-search'

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
    <div className="min-h-screen pb-20 bg-slate-50">
      <Header />
      
      <HeroBanner />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        <section className="-mt-16 relative z-20">
          <AISearch />
        </section>

        <section>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2 font-sans">
                <span className="w-1.5 h-6 bg-brand-600 rounded-r-md"></span>
                Imóveis Recentes
              </h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest pl-3">
                Oportunidades selecionadas pelo algoritmo
              </p>
            </div>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property: any) => (
                <PropertyCard 
                  key={property.id} 
                  property={{
                    ...property,
                    // Garante que o card receba o array de imagens unificado
                    images: property.images || [],
                    // Garante que o título e localização sejam consistentes
                    displayTitle: property.title,
                    displayLocation: `${property.neighborhood}, ${property.city}`
                  }} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-bold uppercase text-[10px]">Aguardando novos cadastros...</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
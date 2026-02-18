import Link from 'next/link'
import { Maximize, Bed, Car, Bath } from 'lucide-react'
import { Property } from '@/lib/services'
import { PropertyCardSlider } from './property-card-slider'

export function PropertyCard({ property }: { property: Property }) {
  const isVenda = property.intent === 'venda'
  const isTerreno = property.type?.toLowerCase() === 'terreno' || property.type?.toLowerCase() === 'lote'
  
  // Lógica de preço com fallback para evitar R$ 0,00
  const displayPrice = isVenda 
    ? (property.sale_price && property.sale_price > 0 ? property.sale_price : property.price)
    : (property.rent_price && property.rent_price > 0 ? property.rent_price : property.price)

  return (
    // ADEQUAÇÃO PASSO 4: Link híbrido usando [slug]-[id]
    <Link 
      href={`/imovel/${property.slug || 'imovel'}-${property.id}`} 
      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col h-full"
    >
      <div className="relative h-48 shrink-0">
        
        <PropertyCardSlider 
          images={property.images || []} 
          title={property.title} 
        />

        <span className={`absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-black text-white uppercase z-20 shadow-sm ${isVenda ? 'bg-orange-600' : 'bg-blue-600'}`}>
          {isVenda ? 'Venda' : 'Aluguel'}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-brand-600 transition-colors mb-1">
          {property.title}
        </h3>
        <p className="text-[11px] text-slate-500 mb-3 font-medium">
          {property.neighborhood}, {property.city}
        </p>
        
        <div className="flex justify-between items-center mb-4 border-y border-slate-50 py-3">
          <div className="flex items-center gap-1 text-[11px] text-slate-600 font-bold" title="Área total">
            <Maximize size={14} className="text-brand-500"/> {property.area}m²
          </div>
          {!isTerreno && (
            <>
              <div className="flex items-center gap-1 text-[11px] text-slate-600 font-bold" title="Quartos">
                <Bed size={14} className="text-brand-500"/> {property.bedrooms || 0}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-600 font-bold" title="Banheiros">
                <Bath size={14} className="text-brand-500"/> {property.bathrooms || 0}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-600 font-bold" title="Vagas">
                <Car size={14} className="text-brand-500"/> {property.parking || 0}
              </div>
            </>
          )}
        </div>
        
        <div className="mt-auto">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">
            {isVenda ? 'Valor de Investimento' : 'Aluguel Mensal'}
          </p>
          <p className="text-xl font-black text-brand-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayPrice || 0)}
          </p>
        </div>
      </div>
    </Link>
  )
}
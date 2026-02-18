import Link from 'next/link'
import { Maximize, Bed, Car, Bath } from 'lucide-react' // Adicionado Bath
import { Property } from '@/lib/services'
import { PropertyCardSlider } from './property-card-slider'

export function PropertyCard({ property }: { property: Property }) {
  // Ajuste de lógica baseado no seu schema
  const isVenda = property.intent === 'venda'
  const isTerreno = property.type === 'terreno' || property.type === 'lote'
  const displayPrice = isVenda ? property.sale_price : property.rent_price

  return (
    <Link href={`/imovel/${property.id}`} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all">
      <div className="relative h-48">
        
        {/* Renderiza o Slider com o array de imagens do banco */}
        <PropertyCardSlider 
          images={property.images || []} 
          title={property.title} 
        />

        <span className={`absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-bold text-white uppercase z-20 ${isVenda ? 'bg-orange-600' : 'bg-blue-600'}`}>
          {isVenda ? 'Venda' : 'Aluguel'}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-brand-600 transition-colors">{property.title}</h3>
        <p className="text-xs text-slate-500 mb-3">{property.neighborhood}</p>
        
        <div className="flex gap-3 mb-3 border-t pt-3">
          <span className="flex items-center gap-1 text-xs text-slate-600" title="Área total">
            <Maximize size={14}/> {property.area}m²
          </span>
          {!isTerreno && (
            <>
              <span className="flex items-center gap-1 text-xs text-slate-600" title="Quartos">
                <Bed size={14}/> {property.bedrooms}
              </span>
              {/* Adicionando banheiro que consta no seu banco */}
              <span className="flex items-center gap-1 text-xs text-slate-600" title="Banheiros">
                <Bath size={14}/> {property.bathrooms}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-600" title="Vagas">
                <Car size={14}/> {property.parking}
              </span>
            </>
          )}
        </div>
        
        <p className="text-[10px] text-slate-400 font-bold uppercase">{isVenda ? 'Preço de Venda' : 'Valor Mensal'}</p>
        <p className="text-lg font-black text-brand-600">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayPrice || 0)}
        </p>
      </div>
    </Link>
  )
}
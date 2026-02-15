import { PropertyService } from '@/lib/services'
import { Header } from '@/components/header'
import { ProposalForm } from '@/components/proposal-form'
import { MapPin, Bed, Bath, Car, Maximize, Landmark } from 'lucide-react'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const property = await PropertyService.getById(id)

  if (!property) {
    notFound()
  }

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  // --- LÓGICA DINÂMICA ---
  const isVenda = property.intent === 'venda'
  const isTerreno = property.type === 'terreno' || property.type === 'lote'
  
  // Define as labels e valores de acordo com o negócio
  const mainPriceLabel = isVenda ? 'Preço de Venda' : 'Aluguel mensal'
  const mainPriceValue = isVenda ? property.sale_price : (property.rent_price || property.price)
  const iptuLabel = isVenda ? 'IPTU (anual)' : 'IPTU (mensal)'

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      {/* Banner Principal com a Foto */}
      <div className="w-full h-[400px] md:h-[500px] relative bg-slate-200">
        <Image
          src={property.images?.[0] || '/placeholder.png'}
          alt={property.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 container-custom">
          <div className="flex gap-2 mb-2">
            <span className="inline-block bg-brand-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              {property.type || 'IMÓVEL'}
            </span>
            <span className={`inline-block text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${isVenda ? 'bg-orange-600' : 'bg-green-600'}`}>
              {isVenda ? 'À Venda' : 'Para Alugar'}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-md">
            {property.title}
          </h1>
          <div className="flex items-center text-white/90 gap-2 mt-2">
            <MapPin className="w-5 h-5 text-brand-400" />
            <p className="text-lg">{property.neighborhood}, {property.city} - {property.state}</p>
          </div>
        </div>
      </div>

      <main className="container-custom pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          {/* Visão Geral Dinâmica */}
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Características</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg text-center">
                <Maximize className="mx-auto w-6 h-6 text-brand-500" />
                <span className="text-2xl font-bold text-slate-800">{property.area} <small className="text-xs font-normal">m²</small></span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Área Total</span>
              </div>

              {/* Só mostra Quartos, Banheiros e Vagas se NÃO for terreno */}
              {!isTerreno && (
                <>
                  <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg text-center">
                    <Bed className="mx-auto w-6 h-6 text-brand-500" />
                    <span className="text-2xl font-bold text-slate-800">{property.bedrooms}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Quartos</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg text-center">
                    <Bath className="mx-auto w-6 h-6 text-brand-500" />
                    <span className="text-2xl font-bold text-slate-800">{property.bathrooms}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Banheiros</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg text-center">
                    <Car className="mx-auto w-6 h-6 text-brand-500" />
                    <span className="text-2xl font-bold text-slate-800">{property.parking}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Vagas</span>
                  </div>
                </>
              )}

              {/* Se for terreno e tiver ponto comercial nas features */}
              {isTerreno && property.features?.commercial_point && (
                <div className="flex flex-col gap-1 p-3 bg-brand-50 rounded-lg text-center border border-brand-100">
                  <Landmark className="mx-auto w-6 h-6 text-brand-600" />
                  <span className="text-xs font-bold text-brand-700 uppercase mt-1">Ponto Comercial</span>
                </div>
              )}
            </div>
          </section>

          {/* Descrição */}
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Sobre o imóvel</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </section>

          {/* Widget de Localização */}
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="text-brand-500" /> Localização
            </h2>
            <div className="w-full h-64 rounded-xl overflow-hidden bg-slate-100 relative">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(property.address + ', ' + property.neighborhood + ', ' + property.city)}&key=SUA_CHAVE_API`}
              ></iframe>
            </div>
          </section>

          {/* Custos Dinâmicos */}
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Condições Financeiras</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600 font-medium">{mainPriceLabel}</span>
                <span className="text-2xl font-black text-brand-600">{formatCurrency(mainPriceValue || 0)}</span>
              </div>
              
              {/* Só mostra condomínio se o valor for > 0 */}
              {property.condo_price > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Condomínio</span>
                  <span className="font-bold text-slate-800">{formatCurrency(property.condo_price)}</span>
                </div>
              )}

              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600">{iptuLabel}</span>
                <span className="font-bold text-slate-800">{formatCurrency(property.iptu_price)}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Coluna da Direita: ProposalForm AGORA COM INTENT */}
        <aside className="lg:col-span-1">
          <ProposalForm 
            propertyId={property.id} 
            propertyTitle={property.title}
            neighborhood={property.neighborhood}
            intent={property.intent} 
          />
        </aside>

      </main>
    </div>
  )
}
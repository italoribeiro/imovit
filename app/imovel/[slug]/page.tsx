import { PropertyService } from '@/lib/services'
import { Header } from '@/components/header'
import { ProposalForm } from '@/components/proposal-form'
import { Metadata } from 'next' // Importado para SEO
import { 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Maximize, 
  Youtube, 
  CheckCircle2, 
  Landmark, 
  FileText 
} from 'lucide-react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
// IMPORTAÇÃO CORRETA - Já estava no seu código
import { WhatsAppButton } from '@/components/whatsapp-button'

interface PageProps {
  // Alterado de 'id' para 'slug' conforme a nova estrutura de pastas
  params: Promise<{ slug: string }>
}

// FUNÇÃO DE SEO: Gera o título e descrição dinâmicos para o Google
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const property = await PropertyService.getBySlugAndId(slug)

  if (!property) return { title: 'Imóvel não encontrado | Imovit AI' }

  return {
    title: `${property.title} | Imovit AI`,
    description: property.description.substring(0, 160),
    openGraph: {
      images: property.images?.[0] ? [property.images[0]] : []
    }
  }
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Agora utiliza o método híbrido para extrair o ID do final da URL
  const property = await PropertyService.getBySlugAndId(slug)

  if (!property) {
    notFound()
  }

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  // --- LÓGICA DE NEGÓCIO ---
  const isVenda = property.intent === 'venda'
  const isTerreno = property.type === 'terreno' || property.type === 'lote'
  
  // Lógica de fallback para garantir que o preço apareça mesmo se o campo específico estiver zerado
  const mainPriceValue: number = (isVenda ? (property.sale_price || property.price) : (property.rent_price || property.price)) || 0;
  
  const messageText = `Olá ${property.owner_name || 'anunciante'}, tenho interesse no imóvel "${property.title}" anunciado por ${formatCurrency(mainPriceValue)}. Aguardo contato.`
  const whatsappUrl = `https://wa.me/55${property.owner_phone?.replace(/\D/g, '')}?text=${encodeURIComponent(messageText)}`

  const lat = Number(property.latitude) || 0
  const lng = Number(property.longitude) || 0

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      <Header />
      
      {/* Banner Principal com Endereço e Número */}
      <div className="w-full h-[450px] md:h-[600px] relative bg-slate-900">
        <Image
          src={property.images?.[0] || '/placeholder.png'}
          alt={property.title}
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto left-1/2 -translate-x-1/2">
          <div className="flex gap-2 mb-4">
            <span className="bg-brand-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
              {property.type}
            </span>
            <span className={`text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest ${isVenda ? 'bg-orange-600' : 'bg-green-600'}`}>
              {isVenda ? 'Venda' : 'Locação'}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 leading-[1.1]">
            {property.title}
          </h1>
          <div className="flex flex-wrap items-center text-white/90 gap-4 text-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-brand-400" />
              <span>
                {property.address}{property.address_number ? `, ${property.address_number}` : ''}
                {property.complement ? ` - ${property.complement}` : ''}
              </span>
            </div>
            <span className="hidden md:block opacity-40">|</span>
            <span>{property.neighborhood}, {property.city} - {property.state}</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <div className="lg:col-span-2 space-y-10">
          
          {/* Características Técnicas */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4 font-sans">Especificações</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
              <div className="space-y-1">
                <Maximize className="w-6 h-6 text-brand-500 mx-auto md:mx-0" />
                <p className="text-2xl font-black text-slate-800">{property.area} <small className="text-xs font-medium">m²</small></p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Área Total</p>
              </div>

              {!isTerreno && (
                <>
                  <div className="space-y-1">
                    <Bed className="w-6 h-6 text-brand-500 mx-auto md:mx-0" />
                    <p className="text-2xl font-black text-slate-800">{property.bedrooms}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Quartos / {property.suites || 0} Suítes</p>
                  </div>
                  <div className="space-y-1">
                    <Bath className="w-6 h-6 text-brand-500 mx-auto md:mx-0" />
                    <p className="text-2xl font-black text-slate-800">{property.bathrooms}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Banheiros</p>
                  </div>
                  <div className="space-y-1">
                    <Car className="w-6 h-6 text-brand-500 mx-auto md:mx-0" />
                    <p className="text-2xl font-black text-slate-800">{property.parking}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Vagas</p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Descrição */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-6 font-sans">Sobre o imóvel</h2>
            <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line font-medium">
              {property.description}
            </p>
          </section>

          {/* DIFERENCIAIS */}
          {property.features && property.features.length > 0 && (
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
               <h2 className="text-2xl font-black text-slate-900 mb-6 font-sans">Diferenciais</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {property.features.map((feature: string) => (
                    <div key={feature} className="flex items-center gap-2 text-slate-700 font-bold">
                      <CheckCircle2 size={18} className="text-green-500" />
                      {feature}
                    </div>
                  ))}
               </div>
            </section>
          )}

          {/* SEÇÃO DE CUSTOS ADICIONAIS (IPTU E CONDOMÍNIO) */}
          {(property.condo_price > 0 || property.iptu_price > 0) && (
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2 font-sans">
                <Landmark className="text-brand-500" /> Outros Valores
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.condo_price > 0 && (
                  <div className="p-5 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Condomínio</span>
                      <span className="text-sm text-slate-400 font-bold tracking-tight">Custo mensal</span>
                    </div>
                    <span className="font-black text-slate-800 text-xl">{formatCurrency(property.condo_price)}</span>
                  </div>
                )}
                {property.iptu_price > 0 && (
                  <div className="p-5 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest">IPTU</span>
                      <span className="text-sm text-slate-400 font-bold tracking-tight">Custo anual</span>
                    </div>
                    <span className="font-black text-slate-800 text-xl">{formatCurrency(property.iptu_price)}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* TOUR EM VÍDEO (Embed Youtube) */}
          {property.video_url && (
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
               <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2 font-sans">
                 <Youtube className="text-red-600" /> Tour em Vídeo
               </h2>
               <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${property.video_url.includes('v=') ? property.video_url.split('v=')[1]?.split('&')[0] : property.video_url.split('/').pop()}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
               </div>
            </section>
          )}

          {/* LOCALIZAÇÃO (OpenStreetMap) */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2 font-sans">
              <MapPin className="text-brand-500" /> Localização Exata
            </h2>
            <div className="w-full h-[400px] rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
               <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01}%2C${lat-0.01}%2C${lng+0.01}%2C${lat+0.01}&layer=mapnik&marker=${lat}%2C${lng}`}
              ></iframe>
            </div>
            <p className="mt-4 text-xs text-slate-400 italic font-medium">Mapa gerado via coordenadas geográficas.</p>
          </section>

        </div>

        {/* Sidebar Direita: Fixa no Scroll */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl sticky top-24">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Investimento Total</h3>
            <div className="mb-6">
               <p className="text-4xl font-black text-brand-600">{formatCurrency(mainPriceValue)}</p>
               {property.condo_price > 0 && (
                 <p className="text-xs text-slate-400 mt-1 font-bold italic tracking-tight">+ {formatCurrency(property.condo_price)} condomínio</p>
               )}
            </div>

            {/* AQUI ESTÁ A ÚNICA ALTERAÇÃO REAL NO SEU CÓDIGO */}
            <div className="space-y-3 mb-8">
               <WhatsAppButton 
                 propertyId={property.id}
                 ownerName={property.owner_name || 'Anunciante'}
                 ownerPhone={property.owner_phone || ''}
                 whatsappUrl={whatsappUrl}
               />
            </div>

            <hr className="mb-8 border-slate-100" />

            <ProposalForm 
              propertyId={property.id} 
              propertyTitle={property.title}
              neighborhood={property.neighborhood}
              intent={property.intent} 
            />
          </div>
        </aside>

      </main>
    </div>
  )
}
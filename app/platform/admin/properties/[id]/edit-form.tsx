'use client'

import { useState } from 'react'
import { updateProperty } from '@/app/actions/properties'
import Link from 'next/link'
import { ArrowLeft, MapPin, DollarSign, Home, List, Loader2, Youtube, User, FileText } from 'lucide-react'
import { ImageGalleryUpload } from '@/components/ui/image-gallery-upload'
import { SubmitButton } from '@/components/submit-button'

// Função de Máscara de Moeda
const currencyMask = (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = e.target.value
  value = value.replace(/\D/g, "")
  value = value.replace(/(\d)(\d{2})$/, "$1,$2")
  value = value.replace(/(?=(\d{3})+(\D))\B/g, ".")
  e.target.value = value
}

// Função de Máscara de Telefone
const phoneMask = (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = e.target.value.replace(/\D/g, "");
  value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  e.target.value = value;
}

// Helper para formatar valor inicial (ex: 1200.5 -> 1.200,50)
const formatCurrency = (value: number | null) => {
  if (!value && value !== 0) return ''
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(value)
}

export default function EditPropertyForm({ property }: { property: any }) {
  const [loadingCep, setLoadingCep] = useState(false)
  
  // Prepara a Action com o ID já vinculado
  const updateWithId = updateProperty.bind(null, property.id)

  // Estado inicial carregado com os dados do banco
  const [addressData, setAddressData] = useState({
    zipcode: property.zipcode || '',
    address: property.address || '',
    address_number: property.address_number || '', // NOVO
    complement: property.complement || '',
    neighborhood: property.neighborhood || '',
    city: property.city || '',
    state: property.state || '',
    latitude: property.latitude || '',
    longitude: property.longitude || ''
  })

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value })
  }

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '')
    if (cep.length !== 8) return

    setLoadingCep(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await res.json()
      
      if (!data.erro) {
        setAddressData(prev => ({
          ...prev,
          zipcode: cep,
          address: data.logradouro || prev.address, 
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.uf || prev.state
        }))

        const query = `${data.logradouro || ''}, ${data.localidade}, ${data.uf}, Brazil`
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
        const geoData = await geoRes.json()

        if (geoData && geoData.length > 0) {
          setAddressData(prev => ({
            ...prev,
            latitude: geoData[0].lat,
            longitude: geoData[0].lon
          }))
        }
      }
    } catch (error) {
      console.error("Erro na busca de CEP", error)
    } finally {
      setLoadingCep(false)
    }
  }

  const featuresString = Array.isArray(property.features) ? property.features.join(', ') : ''

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      <div className="flex items-center gap-4 mb-8">
        <Link href="/platform/admin/properties" className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Editar Imóvel</h1>
          <p className="text-slate-500">Editando: <span className="font-bold text-slate-800">{property.title}</span></p>
        </div>
      </div>

      <form action={updateWithId} className="space-y-8">
        
        {/* 1. DADOS BÁSICOS & VÍDEO */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
            <List size={18} className="text-brand-500" /> Informações Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Título do Anúncio</label>
              <input name="title" defaultValue={property.title} required className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-brand-500" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Descrição</label>
              <textarea name="description" defaultValue={property.description} rows={4} className="w-full p-3 border border-slate-300 rounded-lg resize-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tipo</label>
              <select name="type" defaultValue={property.type} className="w-full p-3 border border-slate-300 rounded-lg bg-white">
                <option value="Apartamento">Apartamento</option>
                <option value="Casa">Casa</option>
                <option value="Terreno">Terreno</option>
                <option value="Comercial">Comercial</option>
                <option value="Flat">Flat</option>
                <option value="Chácara">Chácara</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Finalidade</label>
              <select name="intent" defaultValue={property.intent} className="w-full p-3 border border-slate-300 rounded-lg bg-white">
                <option value="venda">Venda</option>
                <option value="aluguel">Aluguel</option>
              </select>
            </div>

            <div className="md:col-span-2">
               <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                 <Youtube size={14} className="text-red-600" /> Link do Vídeo (YouTube)
               </label>
               <input name="video_url" defaultValue={property.video_url} placeholder="https://youtube.com/watch?v=..." className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
            
            <div className="flex items-center gap-3 mt-2 md:col-span-2">
              <input type="checkbox" name="featured" id="featured" defaultChecked={property.featured} className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500 border-gray-300" />
              <label htmlFor="featured" className="text-sm font-bold text-slate-700 cursor-pointer select-none">Destacar este imóvel na Home?</label>
            </div>
          </div>
        </section>

        {/* 2. DADOS DO ANUNCIANTE - CAMPOS ADICIONAIS INCLUÍDOS */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
            <User size={18} className="text-brand-500" /> Dados do Anunciante
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nome do Responsável</label>
              <input name="owner_name" defaultValue={property.owner_name} className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">E-mail do Anunciante</label>
              <input name="owner_email" defaultValue={property.owner_email} type="email" placeholder="contato@email.com" className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">WhatsApp de Contato</label>
              <input name="owner_phone" defaultValue={property.owner_phone} onChange={phoneMask} placeholder="(00) 00000-0000" className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
          </div>
        </section>

        {/* 3. VALORES */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
            <DollarSign size={18} className="text-brand-500" /> Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Valor Total</label>
              <input name="price" defaultValue={formatCurrency(property.price)} onChange={currencyMask} required className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Promocional</label>
              <input name="sale_price" defaultValue={formatCurrency(property.sale_price)} onChange={currencyMask} className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Condomínio</label>
              <input name="condo_price" defaultValue={formatCurrency(property.condo_price)} onChange={currencyMask} className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">IPTU (Anual)</label>
              <input name="iptu_price" defaultValue={formatCurrency(property.iptu_price)} onChange={currencyMask} className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
          </div>
        </section>

        {/* 4. LOCALIZAÇÃO - CAMPO "NÚMERO" INCLUÍDO */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
            <MapPin size={18} className="text-brand-500" /> Localização
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <label className="block text-sm font-bold text-slate-700 mb-1">CEP</label>
              <input 
                name="zipcode" 
                value={addressData.zipcode}
                onChange={handleAddressChange}
                onBlur={handleCepBlur}
                maxLength={9}
                className="w-full p-3 border border-slate-300 rounded-lg" 
              />
              {loadingCep && <Loader2 className="absolute right-3 top-9 animate-spin text-brand-600" size={20} />}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Endereço</label>
              <input name="address" value={addressData.address} onChange={handleAddressChange} className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Número</label>
              <input name="address_number" value={addressData.address_number} onChange={handleAddressChange} placeholder="Ex: 100" className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Complemento</label>
              <input name="complement" value={addressData.complement} onChange={handleAddressChange} className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Bairro</label>
              <input name="neighborhood" value={addressData.neighborhood} onChange={handleAddressChange} className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Cidade</label>
              <input name="city" value={addressData.city} onChange={handleAddressChange} className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Estado</label>
              <input name="state" value={addressData.state} onChange={handleAddressChange} className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>

            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">Latitude</label>
               <input name="latitude" value={addressData.latitude} onChange={handleAddressChange} className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600" />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">Longitude</label>
               <input name="longitude" value={addressData.longitude} onChange={handleAddressChange} className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600" />
            </div>
          </div>
        </section>

        {/* 5. DETALHES */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
            <Home size={18} className="text-brand-500" /> Detalhes Físicos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Área (m²)</label><input name="area" defaultValue={property.area} type="number" className="w-full p-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quartos</label><input name="bedrooms" defaultValue={property.bedrooms} type="number" className="w-full p-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Suítes</label><input name="suites" defaultValue={property.suites} type="number" className="w-full p-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Banheiros</label><input name="bathrooms" defaultValue={property.bathrooms} type="number" className="w-full p-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vagas</label><input name="parking" defaultValue={property.parking} type="number" className="w-full p-2 border border-slate-300 rounded-lg" /></div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
               <FileText size={14} /> Diferenciais (Separados por vírgula)
            </label>
            <input name="features" defaultValue={featuresString} className="w-full p-3 border border-slate-300 rounded-lg" />
          </div>
        </section>

        {/* 6. GALERIA */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">Imagens</h2>
          <ImageGalleryUpload defaultImages={property.images || []} />
        </section>

        <div className="flex justify-end pt-4">
          <SubmitButton text="Salvar Alterações" loadingText="Atualizando..." />
        </div>
      </form>
    </div>
  )
}
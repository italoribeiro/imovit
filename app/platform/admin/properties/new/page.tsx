'use client'

import { useState } from 'react'
import { createProperty } from '@/app/actions/properties'
import Link from 'next/link'
import { ArrowLeft, MapPin, Search, DollarSign, Home, List, Loader2, Youtube, User, FileText } from 'lucide-react'
import { ImageGalleryUpload } from '@/components/ui/image-gallery-upload'
import { SubmitButton } from '@/components/submit-button'

// --- CORREÇÃO AQUI ---
// 1. O tipo continua ChangeEvent
// 2. Removemos o 'return e' (não precisa retornar nada)
const currencyMask = (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = e.target.value
  value = value.replace(/\D/g, "") // Remove tudo que não é dígito
  value = value.replace(/(\d)(\d{2})$/, "$1,$2") // Coloca a vírgula antes dos 2 últimos dígitos
  value = value.replace(/(?=(\d{3})+(\D))\B/g, ".") // Coloca ponto nos milhares
  e.target.value = value
}

export default function NewPropertyPage() {
  const [loadingCep, setLoadingCep] = useState(false)
  
  const [addressData, setAddressData] = useState({
    zipcode: '',
    address: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    latitude: '',
    longitude: ''
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

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      <div className="flex items-center gap-4 mb-8">
        <Link href="/platform/admin/properties" className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Novo Imóvel</h1>
          <p className="text-slate-500">Preencha os dados completos do imóvel.</p>
        </div>
      </div>

      <form action={createProperty} className="space-y-8">
        
        {/* 1. DADOS BÁSICOS */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
            <List size={18} className="text-brand-500" /> Informações Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Título do Anúncio</label>
              <input name="title" required placeholder="Ex: Apartamento Vista Mar" className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-brand-500" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Descrição</label>
              <textarea name="description" rows={4} className="w-full p-3 border border-slate-300 rounded-lg resize-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tipo</label>
              <select name="type" className="w-full p-3 border border-slate-300 rounded-lg bg-white">
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
              <select name="intent" className="w-full p-3 border border-slate-300 rounded-lg bg-white">
                <option value="venda">Venda</option>
                <option value="aluguel">Aluguel</option>
              </select>
            </div>

            <div className="md:col-span-2">
               <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                 <Youtube size={14} className="text-red-600" /> Link do Vídeo (YouTube)
               </label>
               <input name="video_url" placeholder="https://youtube.com/watch?v=..." className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
            
            <div className="flex items-center gap-3 mt-2 md:col-span-2">
              <input type="checkbox" name="featured" id="featured" className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500 border-gray-300" />
              <label htmlFor="featured" className="text-sm font-bold text-slate-700 cursor-pointer select-none">Destacar este imóvel na Home?</label>
            </div>
          </div>
        </section>

        {/* 2. DADOS DO ANUNCIANTE */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
            <User size={18} className="text-brand-500" /> Dados do Anunciante
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nome do Responsável</label>
              <input name="owner_name" placeholder="Ex: João Silva ou Imobiliária X" className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">WhatsApp de Contato</label>
              <input name="owner_phone" type="tel" placeholder="Ex: 85999999999 (Somente números)" className="w-full p-3 border border-slate-300 rounded-lg" />
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
              {/* --- CORREÇÃO AQUI: Trocado 'onInput' por 'onChange' --- */}
              <input name="price" onChange={currencyMask} placeholder="0,00" required className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Promocional</label>
              <input name="sale_price" onChange={currencyMask} placeholder="0,00" className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Condomínio</label>
              <input name="condo_price" onChange={currencyMask} placeholder="0,00" className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">IPTU (Anual)</label>
              <input name="iptu_price" onChange={currencyMask} placeholder="0,00" className="w-full p-3 border border-slate-300 rounded-lg" />
            </div>
          </div>
        </section>

        {/* 4. LOCALIZAÇÃO */}
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
                placeholder="00000-000"
                maxLength={9}
                className="w-full p-3 border border-slate-300 rounded-lg" 
              />
              {loadingCep && <Loader2 className="absolute right-3 top-9 animate-spin text-brand-600" size={20} />}
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-slate-700 mb-1">Endereço (Logradouro + Número)</label>
              <input 
                name="address" 
                value={addressData.address} 
                onChange={handleAddressChange} 
                placeholder="Ex: Av. Paulista, 1000"
                className="w-full p-3 border border-slate-300 rounded-lg" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Complemento</label>
              <input 
                name="complement" 
                value={addressData.complement} 
                onChange={handleAddressChange} 
                placeholder="Apto 101, Bloco B, Próximo ao mercado..." 
                className="w-full p-3 border border-slate-300 rounded-lg" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Bairro</label>
              <input 
                name="neighborhood" 
                value={addressData.neighborhood} 
                onChange={handleAddressChange} 
                className="w-full p-3 border border-slate-300 rounded-lg" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Cidade</label>
              <input 
                name="city" 
                value={addressData.city} 
                onChange={handleAddressChange} 
                className="w-full p-3 border border-slate-300 rounded-lg" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Estado</label>
              <input 
                name="state" 
                value={addressData.state} 
                onChange={handleAddressChange} 
                className="w-full p-3 border border-slate-300 rounded-lg" 
              />
            </div>

            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">Latitude</label>
               <input 
                 name="latitude" 
                 value={addressData.latitude} 
                 onChange={handleAddressChange} 
                 className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600" 
               />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-1">Longitude</label>
               <input 
                 name="longitude" 
                 value={addressData.longitude} 
                 onChange={handleAddressChange} 
                 className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600" 
               />
            </div>
          </div>
        </section>

        {/* 5. DETALHES */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
            <Home size={18} className="text-brand-500" /> Detalhes Físicos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Área (m²)</label><input name="area" type="number" className="w-full p-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quartos</label><input name="bedrooms" type="number" className="w-full p-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Suítes</label><input name="suites" type="number" className="w-full p-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Banheiros</label><input name="bathrooms" type="number" className="w-full p-2 border border-slate-300 rounded-lg" /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vagas</label><input name="parking" type="number" className="w-full p-2 border border-slate-300 rounded-lg" /></div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
               <FileText size={14} /> Diferenciais (Separados por vírgula)
            </label>
            <input name="features" placeholder="Ex: Piscina, Churrasqueira, Portaria 24h, Varanda Gourmet" className="w-full p-3 border border-slate-300 rounded-lg" />
          </div>
        </section>

        {/* 6. GALERIA */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">Imagens</h2>
          <ImageGalleryUpload />
        </section>

        <div className="flex justify-end pt-4">
          <SubmitButton text="Cadastrar Imóvel" loadingText="Salvando..." />
        </div>
      </form>
    </div>
  )
}
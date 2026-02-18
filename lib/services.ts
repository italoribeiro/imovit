import { supabase } from './supabase'

export interface Property {
  id: number
  created_at: string
  title: string
  description: string
  slug?: string
  intent: 'venda' | 'aluguel' | 'ambos'
  price: number 
  sale_price?: number
  rent_price?: number
  condo_price: number
  iptu_price: number
  zipcode?: string
  address: string
  address_number?: string // Adicionado
  complement?: string
  neighborhood: string
  city: string
  state: string
  area: number
  bedrooms?: number
  suites?: number // Adicionado
  bathrooms?: number
  parking?: number
  images: string[]
  type: string
  featured?: boolean
  latitude: number // Adicionado
  longitude: number // Adicionado
  features: string[] // Ajustado para array de strings conforme nosso novo form
  video_url?: string // Adicionado
  owner_name?: string // Adicionado
  owner_phone?: string // Adicionado
  owner_email?: string
}
export const PropertyService = {
  async getAll() {
    const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
    return data as Property[]
  },
  
  async getById(id: string | number) {
    const { data } = await supabase.from('properties').select('*').eq('id', id).single()
    return data as Property
  },

  // NOVO MÉTODO: Busca pelo formato "nome-do-imovel-123"
  async getBySlugAndId(param: string) {
    // 1. Divide a string pelo hífen
    const parts = param.split('-')
    
    // 2. Captura o último elemento (que deve ser o ID)
    const id = parts[parts.length - 1]

    // 3. Validação básica: se o último item não for um número, tenta buscar pelo slug puro
    if (isNaN(Number(id))) {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('slug', param)
        .single()
      return data as Property
    }

    // 4. Busca no banco pelo ID extraído
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()

    return data as Property
  }
}
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
  async getById(id: string) {
    const { data } = await supabase.from('properties').select('*').eq('id', id).single()
    return data as Property
  }
}
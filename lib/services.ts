import { supabase } from './supabase'

export interface Property {
  id: number
  title: string
  description: string
  intent: 'venda' | 'aluguel' | 'ambos'
  price: number 
  sale_price?: number
  rent_price?: number
  condo_price: number
  iptu_price: number
  address: string
  neighborhood: string
  city: string
  state: string
  area: number
  bedrooms?: number
  bathrooms?: number
  parking?: number
  images: string[]
  type: 'casa' | 'apartamento' | 'terreno' | 'lote'
  features: Record<string, any>
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
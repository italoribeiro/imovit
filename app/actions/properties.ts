'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { generateSlug } from '@/lib/utils'

// --- HELPER: Tratamento de Moeda ---
// Converte "1.200,50" -> 1200.50 (Float para o banco)
function parseCurrency(value: string | null) {
  if (!value) return 0
  // Remove pontos de milhar e troca vírgula decimal por ponto
  const cleanString = value.replace(/\./g, '').replace(',', '.')
  return parseFloat(cleanString) || 0
}

// --- HELPER: Tratamento de Imagens ---
function getImagesFromFormData(formData: FormData) {
  const imagesJson = formData.get('images') as string
  let imagesArray: string[] = []
  
  try {
    // Tenta ler o JSON que o componente novo envia
    if (imagesJson) imagesArray = JSON.parse(imagesJson)
  } catch (e) {
    // Fallback para o método antigo
    imagesArray = formData.getAll('images') as string[]
  }

  if (!Array.isArray(imagesArray)) imagesArray = []
  return imagesArray.filter(img => img && img.trim() !== '')
}

// --- HELPER: Tratamento de Features (Lista de diferenciais) ---
function getFeatures(formData: FormData) {
  const featuresString = formData.get('features') as string
  if (!featuresString) return []
  // Transforma string separada por vírgula em array limpo
  return featuresString.split(',').map(f => f.trim()).filter(f => f !== '')
}

// --- AÇÃO 1: CRIAR IMÓVEL ---
export async function createProperty(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  const title = formData.get('title') as string
  
  const rawData = {
    // Dados Básicos
    title,
    slug: generateSlug(title),
    description: formData.get('description') as string,
    type: formData.get('type') as string,
    intent: formData.get('intent') as string,
    featured: formData.get('featured') === 'on', // Checkbox
    
    // Mídia e Anunciante
    video_url: formData.get('video_url') as string,
    owner_name: formData.get('owner_name') as string,
    owner_phone: formData.get('owner_phone') as string,
    owner_email: formData.get('owner_email') as string,
    // Valores (Usando o parser de moeda)
    price: parseCurrency(formData.get('price') as string),
    sale_price: parseCurrency(formData.get('sale_price') as string),
    condo_price: parseCurrency(formData.get('condo_price') as string),
    iptu_price: parseCurrency(formData.get('iptu_price') as string),

    // Localização (Incluindo complemento)
    zipcode: formData.get('zipcode') as string,
    address: formData.get('address') as string,
    address_number: formData.get('address_number') as string,
    complement: formData.get('complement') as string,
    neighborhood: formData.get('neighborhood') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    latitude: Number(formData.get('latitude') || 0),
    longitude: Number(formData.get('longitude') || 0),

    // Detalhes Físicos
    area: Number(formData.get('area') || 0),
    bedrooms: Number(formData.get('bedrooms') || 0),
    suites: Number(formData.get('suites') || 0),
    bathrooms: Number(formData.get('bathrooms') || 0),
    parking: Number(formData.get('parking') || 0),
    features: getFeatures(formData), // Salva como JSONB
    
    // Imagens
    images: getImagesFromFormData(formData),
  }

  const { error } = await supabase.from('properties').insert([rawData])

  if (error) {
    console.error('[CREATE] Erro ao criar imóvel:', error)
    return 
  }

  revalidatePath('/', 'layout')
  redirect('/platform/admin/properties')
}

// --- AÇÃO 2: ATUALIZAR IMÓVEL ---
export async function updateProperty(propertyId: number, formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  const rawData = {
    title: formData.get('title') as string,
    // slug: generateSlug(...) // Geralmente não mudamos slug na edição para não quebrar links SEO
    description: formData.get('description') as string,
    type: formData.get('type') as string,
    intent: formData.get('intent') as string,
    featured: formData.get('featured') === 'on',
    
    video_url: formData.get('video_url') as string,
    owner_name: formData.get('owner_name') as string,
    owner_phone: formData.get('owner_phone') as string,
    owner_email: formData.get('owner_email') as string,
    price: parseCurrency(formData.get('price') as string),
    sale_price: parseCurrency(formData.get('sale_price') as string),
    condo_price: parseCurrency(formData.get('condo_price') as string),
    iptu_price: parseCurrency(formData.get('iptu_price') as string),

    zipcode: formData.get('zipcode') as string,
    address: formData.get('address') as string,
    address_number: formData.get('address_number') as string,
    complement: formData.get('complement') as string,
    neighborhood: formData.get('neighborhood') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    latitude: Number(formData.get('latitude') || 0),
    longitude: Number(formData.get('longitude') || 0),

    area: Number(formData.get('area') || 0),
    bedrooms: Number(formData.get('bedrooms') || 0),
    suites: Number(formData.get('suites') || 0),
    bathrooms: Number(formData.get('bathrooms') || 0),
    parking: Number(formData.get('parking') || 0),
    features: getFeatures(formData),
    
    images: getImagesFromFormData(formData),
  }

  const { error } = await supabase
    .from('properties')
    .update(rawData)
    .eq('id', propertyId)

  if (error) {
    console.error('[UPDATE] Erro ao atualizar:', error)
    return 
  }
  
  revalidatePath('/', 'layout')
  redirect('/platform/admin/properties')
}

// --- AÇÃO 3: DELETAR ---
export async function deleteProperty(propertyId: number | string, formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  await supabase.from('properties').delete().eq('id', propertyId)
  revalidatePath('/', 'layout')
}
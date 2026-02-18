import { MetadataRoute } from 'next'
import { PropertyService } from '@/lib/services'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://seudominio.com.br' // SUBSTITUA PELO SEU DOMÍNIO REAL

  // 1. Buscar todos os imóveis para gerar os links
  const properties = await PropertyService.getAll()

  // 2. Mapear os imóveis para o formato de sitemap
  const propertyEntries = properties.map((property) => ({
    url: `${baseUrl}/imovel/${property.slug}-${property.id}`,
    lastModified: property.created_at,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // 3. Adicionar páginas estáticas principais
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...propertyEntries,
  ]
}
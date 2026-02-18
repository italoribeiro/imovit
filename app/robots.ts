import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/platform/admin/'], // Protege sua área administrativa
    },
    sitemap: 'https://imovit.netfily.app/sitemap.xml',
  }
}
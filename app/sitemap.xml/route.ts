import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export const dynamic = 'force-static'
export const revalidate = 3600

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.miniteamproject.pl'
}

export async function GET() {
  const base = getBaseUrl()
  const staticUrls = ['/', '/shop', '/blog', '/czesci', '/kontakt', '/polityka-prywatnosci', '/polityka-zwrotow', '/regulamin']
  const [products, blogs]: [
    Array<{ slug?: { current?: string }; _updatedAt?: string }>,
    Array<{ slug?: { current?: string }; _updatedAt?: string; publishedAt?: string }>
  ] = await Promise.all([
    client.fetch(`*[_type == 'product' && defined(slug.current)]{ slug, _updatedAt }`),
    client.fetch(`*[_type == 'blog' && defined(slug.current)]{ slug, _updatedAt, publishedAt }`),
  ])
  const urls = [
    ...staticUrls.map((p) => ({ loc: `${base}${p}`, lastmod: new Date().toISOString() })),
    ...products
      .filter((p) => p?.slug?.current)
      .map((p) => ({ loc: `${base}/product/${p.slug!.current}`, lastmod: (p._updatedAt ? new Date(p._updatedAt) : new Date()).toISOString() })),
    ...blogs
      .filter((b) => b?.slug?.current)
      .map((b) => ({
        loc: `${base}/blog/${b.slug!.current}`,
        lastmod: (b._updatedAt ? new Date(b._updatedAt) : b.publishedAt ? new Date(b.publishedAt) : new Date()).toISOString(),
      })),
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls.map((u) => `<url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('') +
    `</urlset>`
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
}



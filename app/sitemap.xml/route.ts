import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://miniteamproject.pl'
  const staticUrls = ['/', '/shop', '/kontakt', '/polityka-prywatnosci', '/polityka-zwrotow', '/regulamin']
  const products: Array<{ slug?: { current?: string }; _updatedAt?: string }> = await client.fetch(
    `*[_type == 'product' && defined(slug.current)]{ slug, _updatedAt }`
  )
  const urls = [
    ...staticUrls.map((p) => ({ loc: `${base}${p}`, lastmod: new Date().toISOString() })),
    ...products
      .filter((p) => p?.slug?.current)
      .map((p) => ({ loc: `${base}/product/${p.slug!.current}`, lastmod: (p._updatedAt ? new Date(p._updatedAt) : new Date()).toISOString() })),
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls.map((u) => `<url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('') +
    `</urlset>`
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
}



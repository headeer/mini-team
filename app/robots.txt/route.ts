import { NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const body = `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`
  return new NextResponse(body, { headers: { 'Content-Type': 'text/plain' } })
}



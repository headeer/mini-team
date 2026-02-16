import { NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const revalidate = 3600

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.miniteamproject.pl'
}

export async function GET() {
  const base = getBaseUrl()
  const body = `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`
  return new NextResponse(body, { headers: { 'Content-Type': 'text/plain' } })
}



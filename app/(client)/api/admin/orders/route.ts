import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.ADMIN_API_KEY
    const reqKey = req.nextUrl.searchParams.get('key')
    if (apiKey && reqKey !== apiKey) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    const data = await client.fetch(`*[_type == 'order'] | order(orderDate desc)[0...20]{
      orderNumber, customerName, email, totalPrice, currency, status, orderDate
    }`)
    return NextResponse.json({ ok: true, orders: Array.isArray(data) ? data : [] })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 })
  }
}



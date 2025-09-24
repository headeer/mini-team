import { NextRequest, NextResponse } from 'next/server'
import { backendClient } from '@/sanity/lib/backendClient'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const doc: any = {
      _type: 'address',
      name: String(body?.name || ''),
      email: String(body?.email || ''),
      address: String(body?.address || ''),
      city: String(body?.city || ''),
      state: String(body?.state || ''),
      zip: String(body?.zip || ''),
      default: Boolean(body?.default) || false,
      createdAt: new Date().toISOString(),
    }
    const created = await backendClient.create(doc)
    return NextResponse.json({ ok: true, address: created })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 })
  }
}



import { NextResponse } from 'next/server'
import getStripe from '@/lib/stripe'
import { backendClient } from '@/sanity/lib/backendClient'

export async function POST(req: Request) {
  try {
    const stripe = getStripe()
    if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })

    const { session_id, orderNumber } = await req.json()
    if (!session_id || !orderNumber) return NextResponse.json({ error: 'Missing session_id or orderNumber' }, { status: 400 })

    const session = await stripe.checkout.sessions.retrieve(session_id, { expand: ['line_items', 'customer'] })
    const lineItems = session.line_items?.data || []

    const items = lineItems
      .filter((li) => typeof li.quantity === 'number')
      .map((li) => ({
        name: (li.price?.product as any)?.name || li.description || 'Produkt',
        quantity: li.quantity || 1,
        unitAmount: (li.price?.unit_amount || 0) / 100,
        currency: li.price?.currency?.toUpperCase() || 'PLN',
      }))

    const totalNet = (session.amount_subtotal || 0) / 100
    const totalGross = (session.amount_total || 0) / 100
    const email = (session.customer_details?.email || session.customer_email || '')
    const name = (session.customer_details?.name || '')

    // Persist to Sanity (assumes an `order` type exists)
    const doc = {
      _type: 'order',
      orderNumber,
      status: 'paid',
      customerName: name,
      email,
      totalPrice: totalGross,
      totalNet,
      currency: 'PLN',
      orderDate: new Date().toISOString(),
      clerkUserId: (session.metadata as any)?.clerkUserId || undefined,
      items,
      stripe: {
        sessionId: session.id,
        paymentIntent: session.payment_intent || null,
      },
    }

    await backendClient.create(doc)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Finalize order error', err)
    return NextResponse.json({ error: 'Finalize failed' }, { status: 500 })
  }
}



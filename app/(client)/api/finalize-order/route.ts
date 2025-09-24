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

    const totalGross = (session.amount_total || 0) / 100
    const email = (session.customer_details?.email || session.customer_email || '')
    const name = (session.customer_details?.name || '')
    const amountDiscount = (session.total_details?.amount_discount || 0) / 100
    const clerkUserId = (session.metadata as any)?.clerkUserId || 'guest'

    // Persist to Sanity matching schema
    const orderDoc: any = {
      _type: 'order',
      orderNumber,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: (session.payment_intent as string) || '',
      stripeCustomerId: (typeof session.customer === 'string' ? session.customer : (session.customer as any)?.id) || email || 'unknown',
      customerName: name || 'Klient',
      email,
      clerkUserId,
      products: [],
      totalPrice: totalGross,
      currency: String(session.currency || 'pln').toUpperCase(),
      amountDiscount,
      status: 'paid',
      orderDate: new Date().toISOString(),
      address: session.customer_details ? {
        state: session.customer_details.address?.state || '',
        zip: session.customer_details.address?.postal_code || '',
        city: session.customer_details.address?.city || '',
        address: [session.customer_details.address?.line1, session.customer_details.address?.line2].filter(Boolean).join(' '),
        name: session.customer_details.name || name || '',
      } : null,
      invoice: session.invoice ? {
        id: String(session.invoice),
        number: undefined,
        hosted_invoice_url: undefined,
      } : null,
    }

    await backendClient.create(orderDoc)

    // Send basic confirmation emails via Resend (same styling as webhook)
    try {
      const RESEND_API_KEY = process.env.RESEND_API_KEY
      const FROM = process.env.ORDER_EMAIL_FROM || process.env.RESEND_FROM
      const ADMIN = process.env.ORDER_EMAIL_BCC || process.env.ORDER_EMAIL_ADMIN
      if (RESEND_API_KEY && FROM) {
        const rows = lineItems.map((li) => {
          const nm = ((li.price?.product as any)?.name as string) || li.description || 'Produkt'
          const qty = li.quantity || 1
          const unit = (li.price?.unit_amount || 0) / 100
          const curr = String(li.price?.currency || 'pln').toUpperCase()
          return `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee">${nm}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center">${qty}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">${unit.toFixed(2)} ${curr}</td></tr>`
        }).join('')
        const html = `
          <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111">
            <h2 style="margin:0 0 8px">Zamówienie potwierdzone</h2>
            <p style="margin:0 0 12px">Dziękujemy za zakup. Przetwarzamy Twoje zamówienie i wkrótce je wyślemy.</p>
            <p style="margin:0 0 12px"><strong>Numer zamówienia:</strong> ${orderNumber}</p>
            <table style="width:100%;border-collapse:collapse;border:1px solid #eee">
              <thead>
                <tr>
                  <th style="text-align:left;padding:6px 8px;border-bottom:1px solid #eee">Produkt</th>
                  <th style="text-align:center;padding:6px 8px;border-bottom:1px solid #eee">Ilość</th>
                  <th style="text-align:right;padding:6px 8px;border-bottom:1px solid #eee">Cena (brutto)</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
              <tfoot>
                <tr>
                  <td></td>
                  <td style="text-align:right;padding:10px 8px"><strong>Razem:</strong></td>
                  <td style="text-align:right;padding:10px 8px"><strong>${totalGross.toFixed(2)} ${String(session.currency || 'pln').toUpperCase()}</strong></td>
                </tr>
              </tfoot>
            </table>
            <p style="margin:12px 0">W razie pytań: <a href="mailto:teodorczykpt@gmail.com">teodorczykpt@gmail.com</a> • <a href="tel:+48782851962">782‑851‑962</a></p>
            <p style="margin:16px 0 0">Pozdrawiamy,<br/>Mini Team Project</p>
          </div>
        `
        const send = async (to: string | null, subject: string) => {
          if (!to) return
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: FROM, to, subject, html, bcc: ADMIN || undefined }),
          })
        }
        await send(email || null, `Potwierdzenie zamówienia #${orderNumber}`)
        if (ADMIN) await send(ADMIN, `Nowe zamówienie #${orderNumber}`)
      }
    } catch {}

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Finalize order error', err)
    return NextResponse.json({ error: 'Finalize failed' }, { status: 500 })
  }
}



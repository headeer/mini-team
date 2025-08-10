import { describe, it, expect, vi, beforeEach } from 'vitest'
import type StripeNS from 'stripe'

vi.stubEnv('STRIPE_WEBHOOK_SECRET', 'whsec_test')

// Mock next/headers to supply signature
vi.mock('next/headers', () => ({
  headers: () => ({ get: (k: string) => (k === 'stripe-signature' ? 'sig_test' : null) })
}))

// Mock backendClient for Sanity writes
const create = vi.fn().mockResolvedValue({ _id: 'order1' })
const patchCommit = vi.fn().mockResolvedValue({})
const patch = vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ commit: patchCommit }) })
const getDocument = vi.fn().mockResolvedValue({ _id: 'p1', stock: 10 })
vi.mock('@/sanity/lib/backendClient', () => ({ backendClient: { create, patch, getDocument } }))

// Mock Stripe SDK used inside route
const listLineItems = vi.fn().mockResolvedValue({ data: [{ quantity: 2, price: { product: { metadata: { id: 'p1' } } } }] })
const invoicesRetrieve = vi.fn().mockResolvedValue({ id: 'in_1', number: '0001', hosted_invoice_url: 'https://i' })
const constructEvent = vi.fn(() => ({
  type: 'checkout.session.completed',
  data: { object: { id: 'cs_test', amount_total: 2000, currency: 'pln', metadata: { orderNumber: 'ORD-1', customerName: 'Jan', customerEmail: 'jan@ex.pl', address: JSON.stringify({ state: 'DS', zip: '00-000', city: 'Wro', address: 'ul. Test', name: 'Jan' }) }, invoice: 'in_1', total_details: { amount_discount: 0 }, payment_intent: 'pi_1' } }
} as unknown as StripeNS.Event))

vi.mock('@/lib/stripe', () => ({
  default: {
    webhooks: { constructEvent },
    checkout: { sessions: { listLineItems } },
    invoices: { retrieve: invoicesRetrieve },
  }
}))

describe('/api/webhook', () => {
  beforeEach(() => {
    create.mockClear(); patch.mockClear(); patchCommit.mockClear(); getDocument.mockClear()
  })

  it('processes checkout.session.completed and writes order + stock', async () => {
    const { POST } = await import('../webhook/route')
    const req = new Request('http://test/webhook', { method: 'POST', body: 'raw-body' as unknown as BodyInit })
    const res = await POST(req as unknown as Request)
    expect(res.status).toBe(200)
    expect(create).toHaveBeenCalled()
    expect(getDocument).toHaveBeenCalledWith('p1')
    expect(patchCommit).toHaveBeenCalled()
  })

  it('returns 400 without signature', async () => {
    vi.resetModules()
    vi.doMock('next/headers', () => ({ headers: () => ({ get: () => null }) }))
    const { POST } = await import('../webhook/route')
    const req = new Request('http://test/webhook', { method: 'POST', body: 'raw-body' as unknown as BodyInit })
    const res = await POST(req as unknown as Request)
    expect(res.status).toBe(400)
  })
})


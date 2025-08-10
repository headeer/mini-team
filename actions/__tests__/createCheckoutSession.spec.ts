import { describe, it, expect, vi } from 'vitest'
import { createCheckoutSession } from '@/actions/createCheckoutSession'

vi.mock('@/lib/stripe', () => ({
  default: {
    customers: { list: vi.fn().mockResolvedValue({ data: [] }) },
    checkout: { sessions: { create: vi.fn().mockResolvedValue({ url: 'https://stripe.test/checkout' }) } },
  }
}))
vi.mock('@/sanity/lib/image', () => ({ urlFor: () => ({ url: () => 'https://img.test' }) }))
vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000')
vi.stubEnv('NEXT_PUBLIC_SUCCESS_URL', 'http://localhost:3000/success')
vi.stubEnv('NEXT_PUBLIC_CANCEL_URL', 'http://localhost:3000/cart')

describe('createCheckoutSession', () => {
  it('creates a session and returns url', async () => {
    const items = [{ product: { name: 'Łyżka', price: 1000 }, quantity: 1 } as any]
    const url = await createCheckoutSession(items, { orderNumber: 'ORD-1', customerName: 'Jan', customerEmail: 'jan@ex.pl' })
    expect(url).toContain('stripe')
  })
})


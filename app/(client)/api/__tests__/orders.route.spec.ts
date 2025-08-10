import { vi, describe, it, expect } from 'vitest'
import { GET } from '../orders/route'

vi.mock('@clerk/nextjs/server', () => ({ auth: () => ({ userId: 'user_123' }) }))
vi.mock('@/sanity/lib/live', () => ({ sanityFetch: vi.fn().mockResolvedValue({ data: [{ _id: 'o1', total: 123 }] }) }))

describe('/api/orders', () => {
  it('requires auth', async () => {
    vi.resetModules()
    vi.doMock('@clerk/nextjs/server', () => ({ auth: () => ({ userId: null }) }))
    const { GET: UnauthedGET } = await import('../orders/route')
    const res = await UnauthedGET()
    expect(res.status).toBe(401)
  })
  it('returns orders for user', async () => {
    const res = await GET()
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.data[0]._id).toBe('o1')
  })
})


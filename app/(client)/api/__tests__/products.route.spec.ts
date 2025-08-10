import { vi, describe, it, expect } from 'vitest'
import { GET } from '../products/route'

vi.mock('@/sanity/lib/client', () => ({
  client: { fetch: vi.fn().mockResolvedValue([{ _id: 'p1', name: 'Łyżka 60', price: 900 }]) }
}))

describe('/api/products', () => {
  it('returns products json', async () => {
    const res = await GET()
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.data[0].name).toMatch(/Łyżka/)
  })
})


import { describe, it, expect } from 'vitest'
import { POST } from '../contact/route'

describe('/api/contact', () => {
  it('returns ok on valid submission', async () => {
    const fd = new FormData()
    fd.set('name', 'Jan')
    const req = new Request('http://test/contact', { method: 'POST', body: fd as unknown as BodyInit })
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.received.name).toBe('Jan')
  })
})


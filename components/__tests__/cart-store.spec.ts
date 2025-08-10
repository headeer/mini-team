import useStore from '@/store'
import { describe, it, expect } from 'vitest'

const product = { _id: 'p1', name: 'Łyżka', price: 1000 } as { _id: string; name: string; price: number }

describe('Cart store', () => {
  it('adds items and computes totals', () => {
    const add = useStore.getState().addItem
    add(product)
    add(product)
    const items = useStore.getState().getGroupedItems()
    expect(items[0].quantity).toBe(2)
    const total = useStore.getState().getTotalPrice()
    expect(total).toBe(2000)
  })
})


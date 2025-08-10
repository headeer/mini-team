import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import useStore from '@/store'
import AddToCartButton from '@/components/AddToCartButton'

const product = { _id: 'p1', name: 'Łyżka 60', price: 900, stock: 5 } as { _id: string; name: string; price: number; stock: number }

describe('AddToCartButton + store integration', () => {
  it('adds item and increments subtotal/quantity', () => {
    const { getByText } = render(<AddToCartButton product={product} />)
    const button = getByText(/Add to Cart/i)
    fireEvent.click(button)
    const items = useStore.getState().getGroupedItems()
    expect(items[0].quantity).toBe(1)
  })
})


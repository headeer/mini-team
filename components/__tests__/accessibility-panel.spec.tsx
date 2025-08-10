import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AccessibilityPanel from '@/components/AccessibilityPanel'

describe('AccessibilityPanel', () => {
  it('renders skip link and toggles preferences', async () => {
    render(<AccessibilityPanel />)
    const skip = screen.getByText(/Pomiń do treści/i)
    expect(skip).toBeInTheDocument()

    const button = screen.getByRole('button', { name: /panel dostępności/i })
    fireEvent.click(button)

    const highContrast = screen.getByLabelText(/Wysoki kontrast/i) as HTMLInputElement
    expect(highContrast.checked).toBe(false)
    fireEvent.click(highContrast)
    await waitFor(() => {
      expect(document.documentElement.hasAttribute('data-a11y-contrast')).toBe(true)
    })
  })
})


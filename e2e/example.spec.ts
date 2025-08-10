import { test, expect } from '@playwright/test'

test('homepage loads and shows key sections', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await expect(page.getByText('Zobacz w akcji')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Oferta' })).toBeVisible()
})

test('shop page filters render', async ({ page }) => {
  await page.goto('http://localhost:3000/shop')
  await expect(page.getByText('Filtry produktów')).toBeVisible()
  await expect(page.getByPlaceholder('Szukaj: np. łyżka 60 cm ms03')).toBeVisible()
})


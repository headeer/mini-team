import '@testing-library/jest-dom'

// Mock Next.js router and env-safe globals used in components/tests where needed
vi.stubGlobal('crypto', {
  randomUUID: () => 'test-uuid',
})

// Silence console noise in tests by default (opt-in when debugging)
const originalError = console.error
console.error = (...args: any[]) => {
  const first = String(args[0] ?? '')
  if (first.includes('React') || first.includes('Warning')) return
  originalError(...args)
}


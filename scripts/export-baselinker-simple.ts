/* eslint-disable no-console */
import 'dotenv/config'
import { createClient } from 'next-sanity'
import fs from 'fs'
import path from 'path'

type SanityProduct = {
  _id: string
  name?: string
  slug?: { current?: string }
  description?: string
  priceNet?: number
  priceGross?: number
  stock?: number
  images?: any[]
  categories?: { title?: string }[]
  weightRange?: string
  subcategory?: string
  phoneOrderOnly?: boolean
  brand?: { title?: string }
  status?: string
  externalId?: string
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-03-20'

if (!projectId || !dataset) {
  throw new Error('Missing SANITY projectId/dataset envs')
}

const sanityClient = createClient({ projectId, dataset, apiVersion, useCdn: true })

function imageUrlFrom(img: any): string | undefined {
  if (!img) return undefined
  if (img?.asset?.url) return img.asset.url
  if (img?.url) return img.url
  if (img?.externalImage?.url) return img.externalImage.url
  return undefined
}

function escapeCsvValue(value: string): string {
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function formatDescription(description?: string): string {
  if (!description) return ''
  
  const deliveryInfo = '🚚 **Szybka dostawa:** Produkty dostępne na magazynie - wysyłka w ciągu 24h od potwierdzenia zamówienia. Gwarantujemy dostawę w 48h na terenie całej Polski.'
  
  if (!description.includes('Szybka dostawa')) {
    return `${description}\n\n${deliveryInfo}`
  }
  
  return description
}

type SimpleBaselinkerProduct = {
  SKU: string
  Nazwa: string
  Opis: string
  Cena_brutto: number
  VAT: number
  Stan_magazynowy: number
  Kategoria: string
  Marka: string
  Status: string
  Zdjęcie_1: string
  Zdjęcie_2: string
  Zdjęcie_3: string
  Zakres_wagowy: string
  Podkategoria: string
  Zamówienia_telefoniczne: string
}

function convertToSimpleBaselinker(product: SanityProduct): SimpleBaselinkerProduct {
  const sku = product.slug?.current || product.externalId || product._id
  const name = product.name || 'Produkt'
  
  const price_gross = typeof product.priceGross === 'number' && product.priceGross >= 0
    ? product.priceGross
    : (typeof product.priceNet === 'number' ? +(product.priceNet * 1.23).toFixed(2) : 0)

  const category = (product.categories || [])
    .map(c => c?.title)
    .filter(Boolean)
    .join('/') || 'Uncategorized'

  const images = (product.images || [])
    .map(img => imageUrlFrom(img))
    .filter((url): url is string => Boolean(url))
    .slice(0, 3)

  return {
    SKU: sku,
    Nazwa: name,
    Opis: formatDescription(product.description),
    Cena_brutto: price_gross,
    VAT: 23,
    Stan_magazynowy: typeof product.stock === 'number' ? product.stock : 0,
    Kategoria: category,
    Marka: product.brand?.title || 'MiniTeamProject',
    Status: product.status || 'new',
    Zdjęcie_1: images[0] || '',
    Zdjęcie_2: images[1] || '',
    Zdjęcie_3: images[2] || '',
    Zakres_wagowy: product.weightRange || '',
    Podkategoria: product.subcategory || '',
    Zamówienia_telefoniczne: product.phoneOrderOnly ? 'Tak' : 'Nie',
  }
}

function convertToCsv(products: SimpleBaselinkerProduct[]): string {
  if (products.length === 0) return ''
  
  const headers = Object.keys(products[0])
  const csvRows = [headers.join(',')]
  
  for (const product of products) {
    const row = headers.map(header => {
      const value = product[header as keyof SimpleBaselinkerProduct]
      if (value === undefined || value === null) return ''
      return escapeCsvValue(String(value))
    })
    csvRows.push(row.join(','))
  }
  
  return csvRows.join('\n')
}

async function fetchAllProducts(): Promise<SanityProduct[]> {
  const query = `*[_type == 'product' && coalesce(hidden, false) != true && defined(slug.current) && defined(name)] | order(name asc) {
    _id,
    name,
    slug,
    description,
    priceNet,
    priceGross,
    stock,
    images[]{..., "asset": select(defined(asset) => {"url": asset->url}, null), "externalImage": select(defined(externalImage) => externalImage, null)},
    "categories": categories[]->{ title },
    weightRange,
    subcategory,
    phoneOrderOnly,
    "brand": brand->{ title },
    status,
    externalId
  }`
  
  return await sanityClient.fetch(query)
}

async function main() {
  try {
    console.log('🔄 Fetching products from Sanity...')
    const sanityProducts = await fetchAllProducts()
    console.log(`📦 Found ${sanityProducts.length} products`)
    
    console.log('🔄 Converting to simple Baselinker format...')
    const simpleProducts = sanityProducts.map(convertToSimpleBaselinker)
    
    console.log('🔄 Generating simple CSV...')
    const csvContent = convertToCsv(simpleProducts)
    
    // Ensure exports directory exists
    const exportsDir = path.join(process.cwd(), 'exports')
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true })
    }
    
    // Write simple CSV file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const filename = `baselinker-simple-${timestamp}.csv`
    const filepath = path.join(exportsDir, filename)
    
    fs.writeFileSync(filepath, csvContent, 'utf8')
    
    console.log(`✅ Simple Baselinker CSV exported: ${filepath}`)
    console.log(`📊 Exported ${simpleProducts.length} products`)
    console.log(`📋 Columns: ${Object.keys(simpleProducts[0] || {}).length}`)
    
    // Also update the main simple file
    const mainFilepath = path.join(exportsDir, 'baselinker-simple.csv')
    fs.writeFileSync(mainFilepath, csvContent, 'utf8')
    console.log(`📄 Updated main file: ${mainFilepath}`)
    
  } catch (error) {
    console.error('❌ Export failed:', error)
    process.exit(1)
  }
}

main()


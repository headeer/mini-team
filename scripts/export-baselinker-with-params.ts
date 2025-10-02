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
  priceOlx?: number
  priceText?: string
  toothCost?: number
  toothQty?: number
  discount?: number
  stock?: number
  images?: any[]
  categories?: { title?: string }[]
  weightRange?: string
  subcategory?: string
  phoneOrderOnly?: boolean
  brand?: { title?: string }
  status?: string
  externalId?: string
  specifications?: {
    widthCm?: number
    pinDiameterMm?: number
    volumeM3?: number
    cuttingEdge?: string
    toothThickness?: number
    toothCount?: number
    features?: string[]
    machineCompatibility?: string[]
    quickCoupler?: string
    kinetyka?: number
    ramie?: number
  }
  dimensions?: { A?: number; B?: number; C?: number; D?: number }
  teethEnabled?: boolean
  mountSystems?: Array<{
    code?: string
    title?: string
    price?: number
  }>
  technicalDrawing?: {
    url?: string
    title?: string
  }
  technicalDrawings?: Array<{
    title?: string
    code?: string
  }>
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

type BaselinkerProductWithParams = {
  // Basic fields
  product_id: string
  name: string
  description_html: string
  price_gross: number
  vat: number
  quantity: number
  category_path: string
  
  // Images
  image_url_1: string
  image_url_2: string
  image_url_3: string
  image_url_4: string
  image_url_5: string
  image_url_6: string
  image_url_7: string
  image_url_8: string
  image_url_9: string
  image_url_10: string
  
  // Product parameters as Baselinker features
  param_WeightRange: string
  param_Subcategory: string
  param_PhoneOrderOnly: string
  param_TeethEnabled: string
  param_ToothCost: string
  param_ToothQty: string
  param_MountSystems: string
  param_Dimension_A: string
  param_Dimension_B: string
  param_Dimension_C: string
  param_Dimension_D: string
  param_Brand: string
  param_Status: string
  param_ExternalId: string
  
  // Specifications as parameters
  param_WidthCm: string
  param_PinDiameterMm: string
  param_VolumeM3: string
  param_CuttingEdge: string
  param_ToothThickness: string
  param_ToothCount: string
  param_Features: string
  param_MachineCompatibility: string
  param_QuickCoupler: string
  param_Kinetyka: string
  param_Ramie: string
  
  // Technical drawings
  param_TechnicalDrawingUrl: string
  param_TechnicalDrawingTitle: string
  param_TechnicalDrawingsCodes: string
  
  // Pricing
  param_PriceNet: string
  param_PriceOlx: string
  param_PriceText: string
  param_Discount: string
}

function convertToBaselinkerWithParams(product: SanityProduct): BaselinkerProductWithParams {
  const product_id = product.slug?.current || product.externalId || product._id
  const name = product.name || 'Produkt'
  
  const price_gross = typeof product.priceGross === 'number' && product.priceGross >= 0
    ? product.priceGross
    : (typeof product.priceNet === 'number' ? +(product.priceNet * 1.23).toFixed(2) : 0)

  const category_path = (product.categories || [])
    .map(c => c?.title)
    .filter(Boolean)
    .join('/') || 'Uncategorized'

  const images = (product.images || [])
    .map(img => imageUrlFrom(img))
    .filter((url): url is string => Boolean(url))
    .slice(0, 10)

  const mountSystems = (product.mountSystems || [])
    .map(ms => ms?.code)
    .filter(Boolean)
    .join(';')

  const technicalDrawings = (product.technicalDrawings || [])
    .map(td => td?.code)
    .filter(Boolean)
    .join(';')

  const specs = product.specifications || {}
  const features = (specs.features || []).join(';')
  const machineCompatibility = (specs.machineCompatibility || []).join(';')

  return {
    // Basic fields
    product_id,
    name,
    description_html: formatDescription(product.description),
    price_gross,
    vat: 23,
    quantity: typeof product.stock === 'number' ? product.stock : 0,
    category_path,
    
    // Images
    image_url_1: images[0] || '',
    image_url_2: images[1] || '',
    image_url_3: images[2] || '',
    image_url_4: images[3] || '',
    image_url_5: images[4] || '',
    image_url_6: images[5] || '',
    image_url_7: images[6] || '',
    image_url_8: images[7] || '',
    image_url_9: images[8] || '',
    image_url_10: images[9] || '',
    
    // Product parameters as Baselinker features
    param_WeightRange: product.weightRange || '',
    param_Subcategory: product.subcategory || '',
    param_PhoneOrderOnly: product.phoneOrderOnly ? 'true' : 'false',
    param_TeethEnabled: product.teethEnabled ? 'true' : 'false',
    param_ToothCost: typeof product.toothCost === 'number' ? String(product.toothCost) : '',
    param_ToothQty: typeof product.toothQty === 'number' ? String(product.toothQty) : '',
    param_MountSystems: mountSystems,
    param_Dimension_A: typeof product.dimensions?.A === 'number' ? String(product.dimensions.A) : '',
    param_Dimension_B: typeof product.dimensions?.B === 'number' ? String(product.dimensions.B) : '',
    param_Dimension_C: typeof product.dimensions?.C === 'number' ? String(product.dimensions.C) : '',
    param_Dimension_D: typeof product.dimensions?.D === 'number' ? String(product.dimensions.D) : '',
    param_Brand: product.brand?.title || 'MiniTeamProject',
    param_Status: product.status || 'new',
    param_ExternalId: product.externalId || '',
    
    // Specifications as parameters
    param_WidthCm: typeof specs.widthCm === 'number' ? String(specs.widthCm) : '',
    param_PinDiameterMm: typeof specs.pinDiameterMm === 'number' ? String(specs.pinDiameterMm) : '',
    param_VolumeM3: typeof specs.volumeM3 === 'number' ? String(specs.volumeM3) : '',
    param_CuttingEdge: specs.cuttingEdge || '',
    param_ToothThickness: typeof specs.toothThickness === 'number' ? String(specs.toothThickness) : '',
    param_ToothCount: typeof specs.toothCount === 'number' ? String(specs.toothCount) : '',
    param_Features: features,
    param_MachineCompatibility: machineCompatibility,
    param_QuickCoupler: specs.quickCoupler || '',
    param_Kinetyka: typeof specs.kinetyka === 'number' ? String(specs.kinetyka) : '',
    param_Ramie: typeof specs.ramie === 'number' ? String(specs.ramie) : '',
    
    // Technical drawings
    param_TechnicalDrawingUrl: product.technicalDrawing?.url || '',
    param_TechnicalDrawingTitle: product.technicalDrawing?.title || '',
    param_TechnicalDrawingsCodes: technicalDrawings,
    
    // Pricing
    param_PriceNet: typeof product.priceNet === 'number' ? String(product.priceNet) : '',
    param_PriceOlx: typeof product.priceOlx === 'number' ? String(product.priceOlx) : '',
    param_PriceText: product.priceText || '',
    param_Discount: typeof product.discount === 'number' ? String(product.discount) : '',
  }
}

function convertToCsv(products: BaselinkerProductWithParams[]): string {
  if (products.length === 0) return ''
  
  const headers = Object.keys(products[0])
  const csvRows = [headers.join(',')]
  
  for (const product of products) {
    const row = headers.map(header => {
      const value = product[header as keyof BaselinkerProductWithParams]
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
    priceOlx,
    priceText,
    toothCost,
    toothQty,
    discount,
    stock,
    images[]{..., "asset": select(defined(asset) => {"url": asset->url}, null), "externalImage": select(defined(externalImage) => externalImage, null)},
    "categories": categories[]->{ title },
    weightRange,
    subcategory,
    phoneOrderOnly,
    "brand": brand->{ title },
    status,
    externalId,
    specifications,
    dimensions,
    teethEnabled,
    mountSystems[]{
      code,
      title,
      price
    },
    technicalDrawing,
    technicalDrawings[]{
      title,
      code
    }
  }`
  
  return await sanityClient.fetch(query)
}

async function main() {
  try {
    console.log('🔄 Fetching products from Sanity...')
    const sanityProducts = await fetchAllProducts()
    console.log(`📦 Found ${sanityProducts.length} products`)
    
    console.log('🔄 Converting to Baselinker format with parameters...')
    const baselinkerProducts = sanityProducts.map(convertToBaselinkerWithParams)
    
    console.log('🔄 Generating CSV with parameters...')
    const csvContent = convertToCsv(baselinkerProducts)
    
    // Ensure exports directory exists
    const exportsDir = path.join(process.cwd(), 'exports')
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true })
    }
    
    // Write CSV file with parameters
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const filename = `baselinker-with-params-${timestamp}.csv`
    const filepath = path.join(exportsDir, filename)
    
    fs.writeFileSync(filepath, csvContent, 'utf8')
    
    console.log(`✅ Baselinker CSV with parameters exported: ${filepath}`)
    console.log(`📊 Exported ${baselinkerProducts.length} products`)
    console.log(`📋 Total columns: ${Object.keys(baselinkerProducts[0] || {}).length}`)
    
    // Also update the main file
    const mainFilepath = path.join(exportsDir, 'baselinker-with-params.csv')
    fs.writeFileSync(mainFilepath, csvContent, 'utf8')
    console.log(`📄 Updated main file: ${mainFilepath}`)
    
    console.log('\n📋 All parameters included:')
    console.log('   - Weight Range, Subcategory, Phone Orders')
    console.log('   - Teeth settings (enabled, cost, quantity)')
    console.log('   - Mount systems, Dimensions (A,B,C,D)')
    console.log('   - Brand, Status, External ID')
    console.log('   - Specifications (width, volume, cutting edge, etc.)')
    console.log('   - Machine compatibility, Quick coupler')
    console.log('   - Technical drawings')
    console.log('   - Pricing details (net, OLX, discount)')
    
  } catch (error) {
    console.error('❌ Export failed:', error)
    process.exit(1)
  }
}

main()


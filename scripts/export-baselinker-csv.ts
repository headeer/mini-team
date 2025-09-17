/* eslint-disable no-console */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-03-20'
if (!projectId || !dataset) {
  throw new Error('Missing SANITY projectId/dataset envs')
}
const sanityClient = createClient({ projectId, dataset, apiVersion, useCdn: true })

type SanityImage =
  | { asset?: { url?: string } }
  | { url?: string }
  | { externalImage?: { url?: string } }

type SanityProduct = {
  _id: string
  name?: string
  slug?: { current?: string }
  description?: string
  priceNet?: number
  priceGross?: number
  priceOlx?: number
  stock?: number
  phoneOrderOnly?: boolean
  images?: SanityImage[]
  categories?: { title?: string }[]
  weightRange?: string
  subcategory?: string
  toothCost?: number
  toothQty?: number
  teethEnabled?: boolean
  mountSystems?: { code?: string }[]
  dimensions?: { A?: number; B?: number; C?: number; D?: number }
}

const VAT_DEFAULT = 23

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

async function fetchAllProducts(): Promise<SanityProduct[]> {
  const query = `*[_type == 'product']{
    _id,
    name,
    slug,
    description,
    priceNet,
    priceGross,
    priceOlx,
    stock,
    phoneOrderOnly,
    "images": images[]{
      ...,
      "asset": select(
        defined(asset) => {"url": asset->url},
        defined(externalImage) => null,
        null
      ),
      "externalImage": select(defined(externalImage) => externalImage, null)
    },
    "categories": categories[]->{ title },
    weightRange,
    subcategory,
    toothCost,
    toothQty,
    teethEnabled,
    mountSystems[]{ code },
    dimensions
  }`

  const data = await sanityClient.fetch(query)
  return data as SanityProduct[]
}

function imageUrlFrom(img: SanityImage | undefined): string | undefined {
  if (!img) return undefined
  // Prefer direct asset URL
  const asAny: any = img
  if (asAny?.asset?.url) return asAny.asset.url
  if (asAny?.url) return asAny.url
  if (asAny?.externalImage?.url) return asAny.externalImage.url
  return undefined
}

function buildRow(p: SanityProduct) {
  const priceGross = typeof p.priceGross === 'number' && p.priceGross >= 0
    ? p.priceGross
    : (typeof p.priceNet === 'number' ? +(p.priceNet * 1.23).toFixed(2) : '')
  const vat = VAT_DEFAULT
  const quantity = typeof p.stock === 'number' ? p.stock : 0
  const categoryPath = p.categories?.map(c => c?.title).filter(Boolean).join('/') || ''

  const images = (p.images || [])
    .map(img => imageUrlFrom(img))
    .filter(Boolean)
    .slice(0, 10) as string[]

  const mountCodes = (p.mountSystems || [])
    .map(ms => ms?.code)
    .filter(Boolean)
    .join(';')

  const dimA = p.dimensions?.A ?? ''
  const dimB = p.dimensions?.B ?? ''
  const dimC = p.dimensions?.C ?? ''
  const dimD = p.dimensions?.D ?? ''

  const productId = (p.slug?.current ? `${p.slug.current}` : p._id)

  const cols: (string | number)[] = [
    productId, // product_id
    p.name || '',
    p.description || '', // description_html (plain accepted; BL can take HTML too)
    priceGross ?? '',
    vat,
    quantity,
    categoryPath,
    // Up to 10 image columns
    ...Array.from({ length: 10 }, (_, i) => images[i] || ''),
    // Custom params
    p.weightRange || '',
    p.subcategory || '',
    p.phoneOrderOnly ? 'true' : 'false',
    p.teethEnabled ? 'true' : 'false',
    typeof p.toothCost === 'number' ? p.toothCost : '',
    typeof p.toothQty === 'number' ? p.toothQty : '',
    mountCodes,
    dimA,
    dimB,
    dimC,
    dimD,
    '', // Center (not stored in Sanity; placeholder)
    '', // BrandModel (placeholder)
    '', // MachineWeight (placeholder)
  ]

  return cols.map(csvEscape).join(',')
}

async function main() {
  const outDir = path.resolve('exports')
  ensureDir(outDir)
  const outPath = path.join(outDir, 'baselinker-products.csv')

  const header = [
    'product_id','name','description_html','price_gross','vat','quantity','category_path',
    ...Array.from({ length: 10 }, (_, i) => `image_url_${i + 1}`),
    'param_WeightRange','param_Subcategory','param_PhoneOrderOnly','param_TeethEnabled','param_ToothCost','param_ToothQty','param_MountSystems','param_A','param_B','param_C','param_D','param_Center','param_BrandModel','param_MachineWeight'
  ].join(',')

  const products = await fetchAllProducts()
  const rows = products.map(buildRow)
  const csv = [header, ...rows].join('\n')
  fs.writeFileSync(outPath, csv, 'utf8')
  console.log(`Exported ${products.length} products to ${outPath}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})



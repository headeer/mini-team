/* eslint-disable no-console */
import 'dotenv/config'
import { createClient } from 'next-sanity'

type ProductForBL = {
  product_id?: string
  name: string
  description?: string
  price_gross?: number
  vat?: number
  quantity?: number
  // images intentionally omitted for now due to format issue
  category_path?: string
  features?: { name: string; value: string }[]
  images?: string[]
}

async function blRaw(method: string, parameters: Record<string, any>) {
  const res = await fetch('https://api.baselinker.com/connector.php', {
    method: 'POST',
    headers: {
      'X-BLToken': process.env.BASELINKER_API_TOKEN || '',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ method, parameters: JSON.stringify(parameters) }),
  })
  if (!res.ok) throw new Error(`BaseLinker HTTP ${res.status}`)
  return res.json()
}

async function bl<T = any>(method: string, parameters: Record<string, any>) {
  const data = await blRaw(method, parameters)
  if (data?.status && data.status !== 'SUCCESS') {
    throw new Error(`BaseLinker error: ${JSON.stringify(data)}`)
  }
  return data as T
}

async function getInventoryId(): Promise<number> {
  if (process.env.BASELINKER_INVENTORY_ID) return Number(process.env.BASELINKER_INVENTORY_ID)
  const inv = await bl('getInventories', {})
  const id = inv?.inventories?.[0]?.inventory_id
  if (!id) throw new Error('No BaseLinker inventory found. Create one in panel.')
  return id
}

let cachedPriceGroupId: number | null = null
async function getDefaultPriceGroupId(inventory_id: number): Promise<number> {
  if (cachedPriceGroupId) return cachedPriceGroupId
  try {
    const resp = await bl<any>('getInventoryPriceGroups', { inventory_id })
    const pg = resp?.price_groups?.[0]?.price_group_id
    if (typeof pg === 'number') {
      cachedPriceGroupId = pg
      return pg
    }
  } catch {}
  cachedPriceGroupId = 1
  return 1
}

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
  toothCost?: number
  toothQty?: number
  teethEnabled?: boolean
  mountSystems?: { code?: string }[]
  dimensions?: { A?: number; B?: number; C?: number; D?: number }
}

function imageUrlFrom(img: any): string | undefined {
  if (!img) return undefined
  if (img?.asset?.url) return img.asset.url
  if (img?.url) return img.url
  if (img?.externalImage?.url) return img.externalImage.url
  return undefined
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-03-20'
if (!projectId || !dataset) {
  throw new Error('Missing SANITY projectId/dataset envs')
}
const sanityClient = createClient({ projectId, dataset, apiVersion, useCdn: true })

async function fetchAllProducts(): Promise<SanityProduct[]> {
  const oneSlug = process.env.SANITY_ONE_SLUG
  const baseProjection = `{
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
    toothCost,
    toothQty,
    teethEnabled,
    mountSystems[]{ code },
    dimensions
  }`
  if (oneSlug) {
    const query = `*[_type == 'product' && slug.current == $slug][0]${baseProjection}`
    const doc = await sanityClient.fetch(query, { slug: oneSlug })
    return doc ? [doc] as any : []
  }
  const query = `*[_type == 'product' && coalesce(hidden, false) != true && defined(slug.current) && defined(name)]${baseProjection}`
  return await sanityClient.fetch(query)
}

function toBL(p: SanityProduct): ProductForBL {
  const price_gross = typeof p.priceGross === 'number' && p.priceGross >= 0
    ? p.priceGross
    : (typeof p.priceNet === 'number' ? +(p.priceNet * 1.23).toFixed(2) : undefined)
  const category_path = (p.categories || []).map(c => c?.title).filter(Boolean).join('/') || undefined
  const features: { name: string; value: string }[] = []
  if (p.weightRange) features.push({ name: 'WeightRange', value: p.weightRange })
  if (p.subcategory) features.push({ name: 'Subcategory', value: p.subcategory })
  if (typeof p.toothCost === 'number') features.push({ name: 'ToothCost', value: String(p.toothCost) })
  if (typeof p.toothQty === 'number') features.push({ name: 'ToothQty', value: String(p.toothQty) })
  if (p.teethEnabled) features.push({ name: 'TeethEnabled', value: 'true' })
  const mountCodes = (p.mountSystems || []).map(ms => ms?.code).filter(Boolean)
  if (mountCodes.length) features.push({ name: 'MountSystems', value: mountCodes.join(';') })
  if (typeof p.dimensions?.A === 'number') features.push({ name: 'A', value: String(p.dimensions.A) })
  if (typeof p.dimensions?.B === 'number') features.push({ name: 'B', value: String(p.dimensions.B) })
  if (typeof p.dimensions?.C === 'number') features.push({ name: 'C', value: String(p.dimensions.C) })
  if (typeof p.dimensions?.D === 'number') features.push({ name: 'D', value: String(p.dimensions.D) })

  const images = (p.images || [])
    .map((img: any) => imageUrlFrom(img))
    .filter((u: string | undefined): u is string => Boolean(u))
    .slice(0, 10)

  return {
    product_id: p.slug?.current || p._id,
    name: p.name || 'Produkt',
    description: p.description || '',
    price_gross,
    vat: 23,
    quantity: typeof p.stock === 'number' ? p.stock : 0,
    category_path,
    features,
    images,
  }
}

const PINNED_IMAGES_VARIANT: 'images-array-strings' = 'images-array-strings'

async function upsertOne(inventory_id: number, pr: ProductForBL, skuToId?: Map<string, number>) {
  const safeName = (pr.name || '').toString().trim() || 'Produkt'
  const price_group_id = await getDefaultPriceGroupId(inventory_id)
  const base: Record<string, any> = {
    inventory_id,
    text_fields: { name: safeName, description: pr.description || '' },
    prices: [
      {
        price_group_id,
        price_brutto: pr.price_gross,
        tax_rate: pr.vat ?? 23,
      },
    ],
    stock: pr.quantity ?? 0,
    sku: pr.product_id, // use our product identifier as SKU
    features: (pr.features || []).map(f => ({ name: f.name, value: f.value })),
    parameters: (pr.features || []).map(f => ({ name: f.name, value: f.value })),
  }
  // Attach images using detected/attempted variant
  const images = (pr.images || []).filter(Boolean)
  function withImages(payload: Record<string, any>) {
    if (!images.length) return payload
    // Pin to the working format: BaseLinker expects image_urls: string[]
    return { ...payload, image_urls: images }
  }
  let resultProductId: string | number | undefined
  // If SKU exists in BL, prefer updating by found product_id to avoid duplicates
  const existingId = pr.product_id && skuToId?.get(pr.product_id)
  if (existingId) {
    const updatePayload = await withImages({ ...base, product_id: existingId })
    const updateResp = await blRaw('addInventoryProduct', updatePayload)
    if (updateResp?.status === 'SUCCESS') {
      resultProductId = existingId
      if (resultProductId !== undefined) {
        await ensurePriceAndStock(inventory_id, resultProductId as any, pr)
      }
      return updateResp
    }
  }
  if (pr.product_id && !existingId) {
    const updatePayload = await withImages({ ...base, product_id: pr.product_id })
    const updateResp = await blRaw('addInventoryProduct', updatePayload)
    if (updateResp?.status === 'SUCCESS') {
      resultProductId = (updateResp as any)?.product_id ?? pr.product_id
      if (resultProductId !== undefined) {
        await ensurePriceAndStock(inventory_id, resultProductId as any, pr)
      }
      return updateResp
    }
    if (updateResp?.error_code !== 'ERROR_PRODUCT_ID') {
      throw new Error(`BaseLinker error: ${JSON.stringify(updateResp)}`)
    }
  }
  if (process.env.BL_UPDATE_ONLY === '1') {
    return { status: 'SKIPPED' }
  }
  const createPayload = await withImages(base)
  const createResp = await bl<any>('addInventoryProduct', createPayload)
  resultProductId = createResp?.product_id
  if (resultProductId !== undefined) {
    await ensurePriceAndStock(inventory_id, resultProductId as any, pr)
  }
  return createResp
}

async function upsertProductsToBL(products: ProductForBL[]) {
  const inventory_id = await getInventoryId()
  console.log('Using BaseLinker inventory_id:', inventory_id)
  const skuToId = await loadSkuToProductIdMap(inventory_id)
  const limit = process.env.BL_LIMIT ? Number(process.env.BL_LIMIT) : undefined
  const work = typeof limit === 'number' && !Number.isNaN(limit) ? products.slice(0, Math.max(0, limit)) : products
  for (let i = 0; i < work.length; i++) {
    const pr = work[i]
    await upsertOne(inventory_id, pr, skuToId)
    if ((i + 1) % 20 === 0 || i === work.length - 1) {
      console.log(`Upserted ${i + 1}/${work.length}`)
    }
  }
}

async function ensurePriceAndStock(inventory_id: number, product_id: string | number, pr: ProductForBL) {
  const price = typeof pr.price_gross === 'number' ? pr.price_gross : undefined
  const qty = typeof pr.quantity === 'number' ? pr.quantity : undefined
  if (typeof price === 'number') {
    try {
      const price_group_id = await getDefaultPriceGroupId(inventory_id)
      console.log('Updating price', { inventory_id, product_id, price_brutto: price, price_group_id })
      await bl('updateInventoryProductsPrices', {
        inventory_id,
        products: [
          {
            product_id,
            price_group_id,
            price_brutto: price,
            tax_rate: pr.vat ?? 23,
          },
        ],
      })
    } catch (e) {
      // ignore, continue
    }
  }
  if (typeof qty === 'number') {
    try {
      console.log('Updating stock', { inventory_id, product_id, stock: qty })
      await bl('updateInventoryProductsStock', {
        inventory_id,
        products: [
          {
            product_id,
            stock: qty,
          },
        ],
      })
    } catch (e) {
      // ignore, continue
    }
  }
}

async function inspectInventoryShape() {
  const inventory_id = await getInventoryId()
  const list = await bl<any>('getInventoryProductsList', { inventory_id, page: 1 })
  console.log('BL list sample keys:', Object.keys(list || {}))
  const firstId = list?.products?.[0]?.product_id
  console.log('First product id:', firstId)
  if (firstId) {
    const data = await bl<any>('getInventoryProductsData', { inventory_id, products: [firstId] })
    console.log('BL product data shape:', JSON.stringify(data?.products?.[0] || data, null, 2))
  }
}

async function loadSkuToProductIdMap(inventory_id: number): Promise<Map<string, number>> {
  const map = new Map<string, number>()
  let page = 1
  const perPage = 100
  while (true) {
    try {
      const resp = await bl<any>('getInventoryProductsList', { inventory_id, page, products_per_page: perPage })
      const list = Array.isArray(resp?.products) ? resp.products : []
      for (const p of list) {
        const sku = p?.sku || p?.code || p?.product_code
        const pid = p?.product_id
        if (sku && typeof pid === 'number') map.set(String(sku), pid)
      }
      if (list.length < perPage) break
      page += 1
    } catch {
      break
    }
  }
  return map
}

async function main() {
  if (!process.env.BASELINKER_API_TOKEN) throw new Error('Missing BASELINKER_API_TOKEN')
  if (process.env.BL_INSPECT === '1') {
    await inspectInventoryShape()
    return
  }
  const sanityProducts = await fetchAllProducts()
  const blProducts = sanityProducts.map(toBL)
  await upsertProductsToBL(blProducts)
  console.log('Push finished')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})



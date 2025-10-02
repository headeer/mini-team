import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

type SanityProduct = {
  _id: string
  name?: string
  slug?: { current?: string }
  description?: string
  priceNet?: number
  priceGross?: number
  priceOlx?: string
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
  phoneOrderOnly?: boolean
  brand?: { title?: string }
  status?: string
  externalId?: string
  location?: string
  specifications?: Record<string, any>
}

type BaselinkerProduct = {
  product_id: string
  name: string
  description_html: string
  price_gross: number
  vat: number
  quantity: number
  category_path: string
  image_url_1?: string
  image_url_2?: string
  image_url_3?: string
  image_url_4?: string
  image_url_5?: string
  image_url_6?: string
  image_url_7?: string
  image_url_8?: string
  image_url_9?: string
  image_url_10?: string
  param_WeightRange?: string
  param_Subcategory?: string
  param_PhoneOrderOnly?: string
  param_TeethEnabled?: string
  param_ToothCost?: string
  param_ToothQty?: string
  param_MountSystems?: string
  param_A?: string
  param_B?: string
  param_C?: string
  param_D?: string
  param_Center?: string
  param_BrandModel?: string
  param_MachineWeight?: string
}

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

function convertToBaselinker(product: SanityProduct): BaselinkerProduct {
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

  const brandModel = product.brand?.title || ''
  const specs = product.specifications || {}
  const center = specs.center || ''
  const machineWeight = specs.machineWeight || specs.weight || ''

  return {
    product_id,
    name,
    description_html: formatDescription(product.description),
    price_gross,
    vat: 23,
    quantity: typeof product.stock === 'number' ? product.stock : 0,
    category_path,
    image_url_1: images[0],
    image_url_2: images[1],
    image_url_3: images[2],
    image_url_4: images[3],
    image_url_5: images[4],
    image_url_6: images[5],
    image_url_7: images[6],
    image_url_8: images[7],
    image_url_9: images[8],
    image_url_10: images[9],
    param_WeightRange: product.weightRange || '',
    param_Subcategory: product.subcategory || '',
    param_PhoneOrderOnly: product.phoneOrderOnly ? 'true' : 'false',
    param_TeethEnabled: product.teethEnabled ? 'true' : 'false',
    param_ToothCost: typeof product.toothCost === 'number' ? String(product.toothCost) : '',
    param_ToothQty: typeof product.toothQty === 'number' ? String(product.toothQty) : '',
    param_MountSystems: mountSystems,
    param_A: typeof product.dimensions?.A === 'number' ? String(product.dimensions.A) : '',
    param_B: typeof product.dimensions?.B === 'number' ? String(product.dimensions.B) : '',
    param_C: typeof product.dimensions?.C === 'number' ? String(product.dimensions.C) : '',
    param_D: typeof product.dimensions?.D === 'number' ? String(product.dimensions.D) : '',
    param_Center: center,
    param_BrandModel: brandModel,
    param_MachineWeight: machineWeight,
  }
}

function convertToCsv(products: BaselinkerProduct[]): string {
  if (products.length === 0) return ''
  
  const headers = Object.keys(products[0])
  const csvRows = [headers.join(',')]
  
  for (const product of products) {
    const row = headers.map(header => {
      const value = product[header as keyof BaselinkerProduct]
      if (value === undefined || value === null) return ''
      return escapeCsvValue(String(value))
    })
    csvRows.push(row.join(','))
  }
  
  return csvRows.join('\n')
}

export async function GET() {
  try {
    const query = `*[_type == 'product' && coalesce(hidden, false) != true && defined(slug.current) && defined(name)] | order(name asc) {
      _id,
      name,
      slug,
      description,
      priceNet,
      priceGross,
      priceOlx,
      stock,
      images[]{..., "asset": select(defined(asset) => {"url": asset->url}, null), "externalImage": select(defined(externalImage) => externalImage, null)},
      "categories": categories[]->{ title },
      weightRange,
      subcategory,
      toothCost,
      toothQty,
      teethEnabled,
      mountSystems[]{ code },
      dimensions,
      phoneOrderOnly,
      "brand": brand->{ title },
      status,
      externalId,
      location,
      specifications
    }`

    const sanityProducts = await client.fetch(query)
    const baselinkerProducts = sanityProducts.map(convertToBaselinker)
    const csvContent = convertToCsv(baselinkerProducts)

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const filename = `baselinker-products-${timestamp}.csv`

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}


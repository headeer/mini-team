import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

type SanityProduct = {
  _id: string
  _createdAt: string
  _updatedAt: string
  name?: string
  slug?: { current?: string }
  description?: string
  priceNet?: number
  priceGross?: number
  priceOlx?: number
  price?: number
  basePrice?: number
  priceText?: string
  toothCost?: number
  toothQty?: number
  priceTier?: string
  ripperTier?: string
  discount?: number
  stock?: number
  images?: any[]
  categories?: { title?: string; slug?: { current?: string } }[]
  weightRange?: string
  subcategory?: string
  brand?: { title?: string; slug?: { current?: string } }
  status?: string
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
    center?: string
    weight?: string
    machineWeight?: string
  }
  dateUpdated?: string
  phoneOrderOnly?: boolean
  externalId?: string
  location?: string
  viewsCount?: number
  featuredRank?: number
  isFeatured?: boolean
  technicalDrawing?: {
    url?: string
    title?: string
    type?: string
  }
  technicalDrawings?: Array<{
    title?: string
    code?: string
    externalUrl?: string
    image?: { asset?: { url?: string } }
    file?: { asset?: { url?: string } }
  }>
  mountSystems?: Array<{
    code?: string
    title?: string
    price?: number
    drawingImage?: { asset?: { url?: string } }
    drawingFileAsset?: { asset?: { url?: string } }
    drawingFile?: string
    productRef?: { _id?: string; slug?: { current?: string } }
  }>
  dimensions?: { A?: number; B?: number; C?: number; D?: number }
  teethEnabled?: boolean
  drillBits?: Array<{
    title?: string
    price?: number
    productRef?: { _id?: string; slug?: { current?: string } }
  }>
  similarProducts?: Array<{
    _id?: string
    name?: string
    slug?: { current?: string }
  }>
  recommendationSettings?: {
    enabled?: boolean
    customKeywords?: string[]
    excludeCategories?: string[]
  }
  hidden?: boolean
}

type ComprehensiveProduct = {
  // Basic Info
  product_id: string
  name: string
  description_html: string
  slug: string
  external_id: string
  
  // Pricing
  price_net: number
  price_gross: number
  price_olx: number
  price_legacy: number
  base_price: number
  price_text: string
  discount_percent: number
  
  // Teeth & Pricing
  tooth_cost: number
  tooth_quantity: number
  teeth_enabled: string
  
  // Categories & Classification
  category_path: string
  category_slugs: string
  weight_range: string
  subcategory: string
  price_tier: string
  ripper_tier: string
  
  // Brand & Status
  brand_name: string
  brand_slug: string
  status: string
  is_featured: string
  featured_rank: number
  
  // Stock & Availability
  quantity: number
  phone_order_only: string
  location: string
  
  // Images (up to 10)
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
  
  // Dimensions
  dimension_a: number
  dimension_b: number
  dimension_c: number
  dimension_d: number
  
  // Mount Systems
  mount_systems_codes: string
  mount_systems_titles: string
  mount_systems_prices: string
  
  // Drill Bits
  drill_bits_titles: string
  drill_bits_prices: string
  
  // Technical Drawings
  technical_drawing_url: string
  technical_drawing_title: string
  technical_drawings_codes: string
  technical_drawings_titles: string
  technical_drawings_urls: string
  
  // Specifications
  spec_width_cm: number
  spec_pin_diameter_mm: number
  spec_volume_m3: number
  spec_cutting_edge: string
  spec_tooth_thickness: number
  spec_tooth_count: number
  spec_features: string
  spec_machine_compatibility: string
  spec_quick_coupler: string
  spec_kinetyka: number
  spec_ramie: number
  spec_center: string
  spec_weight: string
  spec_machine_weight: string
  
  // Similar Products
  similar_products_names: string
  similar_products_slugs: string
  
  // Recommendation Settings
  recommendation_enabled: string
  recommendation_keywords: string
  recommendation_exclude_categories: string
  
  // Analytics & Metadata
  views_count: number
  date_updated: string
  date_created: string
  
  // Baselinker specific
  vat: number
}

function imageUrlFrom(img: any): string | undefined {
  if (!img) return undefined
  if (img?.asset?.url) return img.asset.url
  if (img?.url) return img.url
  if (img?.externalImage?.url) return img.externalImage.url
  return undefined
}

function escapeCsvValue(value: string | number | boolean | undefined | null): string {
  if (value === undefined || value === null) return ''
  const stringValue = String(value)
  if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

function formatDescription(description?: string): string {
  if (!description) return ''
  
  const deliveryInfo = '🚚 **Szybka dostawa:** Produkty dostępne na magazynie - wysyłka w ciągu 24h od potwierdzenia zamówienia. Gwarantujemy dostawę w 48h na terenie całej Polski.'
  
  if (!description.includes('Szybka dostawa')) {
    return `${description}\n\n${deliveryInfo}`
  }
  
  return description
}

function convertToComprehensive(product: SanityProduct): ComprehensiveProduct {
  const product_id = product.slug?.current || product.externalId || product._id
  const name = product.name || 'Produkt'
  const slug = product.slug?.current || ''
  const external_id = product.externalId || ''
  
  // Pricing
  const price_net = product.priceNet || 0
  const price_gross = product.priceGross || (price_net * 1.23)
  const price_olx = product.priceOlx || 0
  const price_legacy = product.price || 0
  const base_price = product.basePrice || 0
  const price_text = product.priceText || ''
  const discount_percent = product.discount || 0
  
  // Teeth
  const tooth_cost = product.toothCost || 0
  const tooth_quantity = product.toothQty || 0
  const teeth_enabled = product.teethEnabled ? 'true' : 'false'
  
  // Categories
  const category_path = (product.categories || [])
    .map(c => c?.title)
    .filter(Boolean)
    .join('/') || 'Uncategorized'
  const category_slugs = (product.categories || [])
    .map(c => c?.slug?.current)
    .filter(Boolean)
    .join(',')
  
  // Images
  const images = (product.images || [])
    .map(img => imageUrlFrom(img))
    .filter((url): url is string => Boolean(url))
    .slice(0, 10)
  
  // Mount Systems
  const mountSystems = product.mountSystems || []
  const mount_systems_codes = mountSystems.map(ms => ms?.code).filter(Boolean).join(';')
  const mount_systems_titles = mountSystems.map(ms => ms?.title).filter(Boolean).join(';')
  const mount_systems_prices = mountSystems.map(ms => ms?.price).filter(Boolean).join(';')
  
  // Drill Bits
  const drillBits = product.drillBits || []
  const drill_bits_titles = drillBits.map(db => db?.title).filter(Boolean).join(';')
  const drill_bits_prices = drillBits.map(db => db?.price).filter(Boolean).join(';')
  
  // Technical Drawings
  const technicalDrawing = product.technicalDrawing || {}
  const technical_drawing_url = technicalDrawing.url || ''
  const technical_drawing_title = technicalDrawing.title || ''
  
  const technicalDrawings = product.technicalDrawings || []
  const technical_drawings_codes = technicalDrawings.map(td => td?.code).filter(Boolean).join(';')
  const technical_drawings_titles = technicalDrawings.map(td => td?.title).filter(Boolean).join(';')
  const technical_drawings_urls = technicalDrawings.map(td => 
    td?.image?.asset?.url || td?.file?.asset?.url || td?.externalUrl
  ).filter(Boolean).join(';')
  
  // Specifications
  const specs = product.specifications || {}
  const spec_features = (specs.features || []).join(';')
  const spec_machine_compatibility = (specs.machineCompatibility || []).join(';')
  
  // Similar Products
  const similarProducts = product.similarProducts || []
  const similar_products_names = similarProducts.map(sp => sp?.name).filter(Boolean).join(';')
  const similar_products_slugs = similarProducts.map(sp => sp?.slug?.current).filter(Boolean).join(';')
  
  // Recommendation Settings
  const recSettings = product.recommendationSettings || {}
  const recommendation_enabled = recSettings.enabled ? 'true' : 'false'
  const recommendation_keywords = (recSettings.customKeywords || []).join(';')
  const recommendation_exclude_categories = (recSettings.excludeCategories || []).join(';')
  
  return {
    // Basic Info
    product_id,
    name,
    description_html: formatDescription(product.description),
    slug,
    external_id,
    
    // Pricing
    price_net,
    price_gross,
    price_olx,
    price_legacy,
    base_price,
    price_text,
    discount_percent,
    
    // Teeth & Pricing
    tooth_cost,
    tooth_quantity,
    teeth_enabled,
    
    // Categories & Classification
    category_path,
    category_slugs,
    weight_range: product.weightRange || '',
    subcategory: product.subcategory || '',
    price_tier: product.priceTier || '',
    ripper_tier: product.ripperTier || '',
    
    // Brand & Status
    brand_name: product.brand?.title || '',
    brand_slug: product.brand?.slug?.current || '',
    status: product.status || '',
    is_featured: product.isFeatured ? 'true' : 'false',
    featured_rank: product.featuredRank || 0,
    
    // Stock & Availability
    quantity: product.stock || 0,
    phone_order_only: product.phoneOrderOnly ? 'true' : 'false',
    location: product.location || '',
    
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
    
    // Dimensions
    dimension_a: product.dimensions?.A || 0,
    dimension_b: product.dimensions?.B || 0,
    dimension_c: product.dimensions?.C || 0,
    dimension_d: product.dimensions?.D || 0,
    
    // Mount Systems
    mount_systems_codes,
    mount_systems_titles,
    mount_systems_prices,
    
    // Drill Bits
    drill_bits_titles,
    drill_bits_prices,
    
    // Technical Drawings
    technical_drawing_url,
    technical_drawing_title,
    technical_drawings_codes,
    technical_drawings_titles,
    technical_drawings_urls,
    
    // Specifications
    spec_width_cm: specs.widthCm || 0,
    spec_pin_diameter_mm: specs.pinDiameterMm || 0,
    spec_volume_m3: specs.volumeM3 || 0,
    spec_cutting_edge: specs.cuttingEdge || '',
    spec_tooth_thickness: specs.toothThickness || 0,
    spec_tooth_count: specs.toothCount || 0,
    spec_features,
    spec_machine_compatibility,
    spec_quick_coupler: specs.quickCoupler || '',
    spec_kinetyka: specs.kinetyka || 0,
    spec_ramie: specs.ramie || 0,
    spec_center: specs.center || '',
    spec_weight: specs.weight || '',
    spec_machine_weight: specs.machineWeight || '',
    
    // Similar Products
    similar_products_names,
    similar_products_slugs,
    
    // Recommendation Settings
    recommendation_enabled,
    recommendation_keywords,
    recommendation_exclude_categories,
    
    // Analytics & Metadata
    views_count: product.viewsCount || 0,
    date_updated: product.dateUpdated || '',
    date_created: product._createdAt || '',
    
    // Baselinker specific
    vat: 23,
  }
}

function convertToCsv(products: ComprehensiveProduct[]): string {
  if (products.length === 0) return ''
  
  const headers = Object.keys(products[0])
  const csvRows = [headers.join(',')]
  
  for (const product of products) {
    const row = headers.map(header => {
      const value = product[header as keyof ComprehensiveProduct]
      return escapeCsvValue(value)
    })
    csvRows.push(row.join(','))
  }
  
  return csvRows.join('\n')
}

export async function GET() {
  try {
    const query = `*[_type == 'product' && coalesce(hidden, false) != true && defined(slug.current) && defined(name)] | order(name asc) {
      _id,
      _createdAt,
      _updatedAt,
      name,
      slug,
      description,
      priceNet,
      priceGross,
      priceOlx,
      price,
      basePrice,
      priceText,
      toothCost,
      toothQty,
      priceTier,
      ripperTier,
      discount,
      stock,
      images[]{..., "asset": select(defined(asset) => {"url": asset->url}, null), "externalImage": select(defined(externalImage) => externalImage, null)},
      "categories": categories[]->{ title, "slug": slug.current },
      weightRange,
      subcategory,
      "brand": brand->{ title, "slug": slug.current },
      status,
      specifications,
      dateUpdated,
      phoneOrderOnly,
      externalId,
      location,
      viewsCount,
      featuredRank,
      isFeatured,
      technicalDrawing,
      technicalDrawings[]{
        title,
        code,
        externalUrl,
        image{asset->{url}},
        file{asset->{url}}
      },
      mountSystems[]{
        code,
        title,
        price,
        drawingImage{asset->{url}},
        drawingFileAsset{asset->{url}},
        drawingFile,
        productRef->{_id, slug}
      },
      dimensions,
      teethEnabled,
      drillBits[]{
        title,
        price,
        productRef->{_id, slug}
      },
      similarProducts[]->{_id, name, slug},
      recommendationSettings,
      hidden
    }`

    const sanityProducts = await client.fetch(query)
    const comprehensiveProducts = sanityProducts.map(convertToComprehensive)
    const csvContent = convertToCsv(comprehensiveProducts)

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const filename = `comprehensive-products-${timestamp}.csv`

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

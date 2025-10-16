/* eslint-disable no-console */
import 'dotenv/config'
import { createClient } from 'next-sanity'

// Baselinker API types
type BaselinkerProduct = {
  product_id: string
  name: string
  description?: string
  sku?: string
  ean?: string
  price_brutto?: number
  price_netto?: number
  vat_rate?: number
  quantity?: number
  weight?: number
  height?: number
  width?: number
  length?: number
  features?: Array<{ name: string; value: string }>
  parameters?: Array<{ name: string; value: string }>
  images?: string[]
  category_id?: number
  category_path?: string
  created_at?: string
  updated_at?: string
}

type BaselinkerCategory = {
  category_id: number
  name: string
  parent_id?: number
  description?: string
}

type BaselinkerPriceGroup = {
  price_group_id: number
  name: string
  currency: string
  description?: string
}

// Sanity types
type SanityProduct = {
  _id: string
  _type: 'product'
  _createdAt: string
  _updatedAt: string
  _rev: string
  name?: string
  slug?: { current?: string }
  description?: string
  priceNet?: number
  priceGross?: number
  priceOlx?: number
  priceText?: string
  stock?: number
  images?: any[]
  categories?: { _ref: string }[]
  weightRange?: string
  subcategory?: string
  toothCost?: number
  toothQty?: number
  teethEnabled?: boolean
  mountSystems?: { code?: string; title?: string; price?: number }[]
  dimensions?: { A?: number; B?: number; C?: number; D?: number }
  specifications?: any
  brand?: { _ref: string }
  status?: string
  externalId?: string
  hidden?: boolean
  phoneOrderOnly?: boolean
  discount?: number
  technicalDrawing?: any
  technicalDrawings?: any[]
}

// Sync configuration
interface SyncConfig {
  inventory_id: number
  price_group_id: number
  default_category_id?: number
  sync_direction: 'baselinker_to_sanity' | 'sanity_to_baselinker' | 'bidirectional'
  dry_run: boolean
  batch_size: number
  create_missing_categories: boolean
  update_existing_products: boolean
  create_new_products: boolean
}

class BaselinkerSyncSystem {
  private sanityClient: any
  private config: SyncConfig

  constructor(config: SyncConfig) {
    this.config = config
    this.sanityClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET!,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-03-20',
      useCdn: false,
      token: process.env.SANITY_API_TOKEN
    })
  }

  // Baselinker API methods
  private async blRaw(method: string, parameters: Record<string, any>) {
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

  private async bl<T = any>(method: string, parameters: Record<string, any>) {
    const data = await this.blRaw(method, parameters)
    if (data?.status && data.status !== 'SUCCESS') {
      throw new Error(`BaseLinker error: ${JSON.stringify(data)}`)
    }
    return data as T
  }

  // Get all products from Baselinker
  async getAllBaselinkerProducts(): Promise<BaselinkerProduct[]> {
    const allProducts: BaselinkerProduct[] = []
    let page = 1
    const limit = 100

    while (true) {
      try {
        console.log(`📦 Fetching Baselinker products page ${page}...`)
        const response = await this.bl<{ products: BaselinkerProduct[] }>('getInventoryProductsList', {
          inventory_id: this.config.inventory_id,
          page,
          filter_quantity_from: 0,
          filter_quantity_to: 999999,
          filter_availability: 0,
          filter_sort: 'name',
          filter_order: 'ASC'
        })

        const products = response?.products || []
        if (products.length === 0) break

        allProducts.push(...products)
        console.log(`   ✅ Fetched ${products.length} products`)
        
        if (products.length < limit) break
        page++
      } catch (error) {
        console.error(`   ❌ Error fetching page ${page}:`, error)
        break
      }
    }

    return allProducts
  }

  // Get all products from Sanity
  async getAllSanityProducts(): Promise<SanityProduct[]> {
    console.log('📦 Fetching Sanity products...')
    const query = `*[_type == 'product' && defined(slug.current) && defined(name)] | order(name asc) {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      name,
      slug,
      description,
      priceNet,
      priceGross,
      priceOlx,
      priceText,
      stock,
      images[]{..., "asset": select(defined(asset) => {"url": asset->url}, null), "externalImage": select(defined(externalImage) => externalImage, null)},
      "categories": categories[]->{ _id, title },
      weightRange,
      subcategory,
      toothCost,
      toothQty,
      teethEnabled,
      mountSystems[]{
        code,
        title,
        price
      },
      dimensions,
      specifications,
      "brand": brand->{ _id, title },
      status,
      externalId,
      hidden,
      phoneOrderOnly,
      discount,
      technicalDrawing,
      technicalDrawings[]
    }`
    
    const products = await this.sanityClient.fetch(query)
    console.log(`   ✅ Fetched ${products.length} products from Sanity`)
    return products
  }

  // Convert Baselinker product to Sanity format
  private convertBaselinkerToSanity(blProduct: BaselinkerProduct): Partial<SanityProduct> {
    const features = blProduct.features || []
    const parameters = blProduct.parameters || []
    
    // Extract specific features
    const weightRange = features.find(f => f.name === 'WeightRange')?.value
    const subcategory = features.find(f => f.name === 'Subcategory')?.value
    const toothCost = features.find(f => f.name === 'ToothCost')?.value
    const toothQty = features.find(f => f.name === 'ToothQty')?.value
    const teethEnabled = features.find(f => f.name === 'TeethEnabled')?.value === 'true'
    const mountSystems = features.find(f => f.name === 'MountSystems')?.value?.split(';').map(code => ({ code: code.trim() })) || []
    
    // Extract dimensions
    const dimensions = {
      A: features.find(f => f.name === 'A')?.value ? parseFloat(features.find(f => f.name === 'A')!.value) : undefined,
      B: features.find(f => f.name === 'B')?.value ? parseFloat(features.find(f => f.name === 'B')!.value) : undefined,
      C: features.find(f => f.name === 'C')?.value ? parseFloat(features.find(f => f.name === 'C')!.value) : undefined,
      D: features.find(f => f.name === 'D')?.value ? parseFloat(features.find(f => f.name === 'D')!.value) : undefined,
    }

    // Convert images
    const images = (blProduct.images || []).map(url => ({
      externalImage: { url }
    }))

    return {
      _type: 'product',
      name: blProduct.name,
      slug: { current: blProduct.sku || blProduct.product_id },
      description: blProduct.description || '',
      priceNet: blProduct.price_netto,
      priceGross: blProduct.price_brutto,
      stock: blProduct.quantity || 0,
      images,
      weightRange,
      subcategory,
      toothCost: toothCost ? parseFloat(toothCost) : undefined,
      toothQty: toothQty ? parseInt(toothQty) : undefined,
      teethEnabled,
      mountSystems,
      dimensions: Object.values(dimensions).some(v => v !== undefined) ? dimensions : undefined,
      externalId: blProduct.product_id,
      hidden: false,
      status: 'active'
    }
  }

  // Convert Sanity product to Baselinker format
  private convertSanityToBaselinker(sanityProduct: SanityProduct): Partial<BaselinkerProduct> {
    const features: Array<{ name: string; value: string }> = []
    
    // Add features
    if (sanityProduct.weightRange) features.push({ name: 'WeightRange', value: sanityProduct.weightRange })
    if (sanityProduct.subcategory) features.push({ name: 'Subcategory', value: sanityProduct.subcategory })
    if (sanityProduct.toothCost) features.push({ name: 'ToothCost', value: sanityProduct.toothCost.toString() })
    if (sanityProduct.toothQty) features.push({ name: 'ToothQty', value: sanityProduct.toothQty.toString() })
    if (sanityProduct.teethEnabled) features.push({ name: 'TeethEnabled', value: 'true' })
    
    // Add mount systems
    if (sanityProduct.mountSystems?.length) {
      const mountCodes = sanityProduct.mountSystems.map(ms => ms.code).filter(Boolean)
      if (mountCodes.length) {
        features.push({ name: 'MountSystems', value: mountCodes.join(';') })
      }
    }
    
    // Add dimensions
    if (sanityProduct.dimensions) {
      Object.entries(sanityProduct.dimensions).forEach(([key, value]) => {
        if (typeof value === 'number') {
          features.push({ name: key, value: value.toString() })
        }
      })
    }

    // Convert images
    const images = (sanityProduct.images || [])
      .map((img: any) => {
        if (img?.asset?.url) return img.asset.url
        if (img?.externalImage?.url) return img.externalImage.url
        return null
      })
      .filter(Boolean)

    return {
      product_id: sanityProduct.slug?.current || sanityProduct._id,
      name: sanityProduct.name || 'Produkt',
      description: sanityProduct.description || '',
      sku: sanityProduct.slug?.current || sanityProduct._id,
      price_brutto: sanityProduct.priceGross,
      price_netto: sanityProduct.priceNet,
      vat_rate: 23,
      quantity: sanityProduct.stock || 0,
      features,
      parameters: features, // Use same as features for now
      images,
      category_id: this.config.default_category_id
    }
  }

  // Sync from Baselinker to Sanity
  async syncFromBaselinkerToSanity(): Promise<void> {
    console.log('🔄 Starting sync from Baselinker to Sanity...')
    
    const blProducts = await this.getAllBaselinkerProducts()
    const sanityProducts = await this.getAllSanityProducts()
    
    // Create a map of existing Sanity products by externalId
    const sanityByExternalId = new Map<string, SanityProduct>()
    sanityProducts.forEach(p => {
      if (p.externalId) {
        sanityByExternalId.set(p.externalId, p)
      }
    })

    let created = 0
    let updated = 0
    let skipped = 0

    for (const blProduct of blProducts) {
      try {
        const sanityData = this.convertBaselinkerToSanity(blProduct)
        const existingProduct = sanityByExternalId.get(blProduct.product_id)

        if (existingProduct) {
          if (this.config.update_existing_products) {
            if (!this.config.dry_run) {
              await this.sanityClient
                .patch(existingProduct._id)
                .set(sanityData)
                .commit()
            }
            console.log(`   ✅ Updated: ${blProduct.name}`)
            updated++
          } else {
            console.log(`   ⏭️  Skipped existing: ${blProduct.name}`)
            skipped++
          }
        } else {
          if (this.config.create_new_products) {
            if (!this.config.dry_run) {
              await this.sanityClient.create(sanityData)
            }
            console.log(`   ✅ Created: ${blProduct.name}`)
            created++
          } else {
            console.log(`   ⏭️  Skipped new: ${blProduct.name}`)
            skipped++
          }
        }
      } catch (error) {
        console.error(`   ❌ Error processing ${blProduct.name}:`, error)
      }
    }

    console.log(`\n📊 Sync Summary:`)
    console.log(`   Created: ${created}`)
    console.log(`   Updated: ${updated}`)
    console.log(`   Skipped: ${skipped}`)
  }

  // Sync from Sanity to Baselinker
  async syncFromSanityToBaselinker(): Promise<void> {
    console.log('🔄 Starting sync from Sanity to Baselinker...')
    
    const sanityProducts = await this.getAllSanityProducts()
    const blProducts = await this.getAllBaselinkerProducts()
    
    // Create a map of existing Baselinker products by SKU
    const blBySku = new Map<string, BaselinkerProduct>()
    blProducts.forEach(p => {
      if (p.sku) {
        blBySku.set(p.sku, p)
      }
    })

    let created = 0
    let updated = 0
    let skipped = 0

    for (const sanityProduct of sanityProducts) {
      try {
        const blData = this.convertSanityToBaselinker(sanityProduct)
        const sku = blData.sku || sanityProduct.slug?.current || sanityProduct._id
        const existingProduct = blBySku.get(sku)

        if (existingProduct) {
          if (this.config.update_existing_products) {
            if (!this.config.dry_run) {
              await this.bl('addInventoryProduct', {
                inventory_id: this.config.inventory_id,
                product_id: existingProduct.product_id,
                ...blData
              })
            }
            console.log(`   ✅ Updated: ${sanityProduct.name}`)
            updated++
          } else {
            console.log(`   ⏭️  Skipped existing: ${sanityProduct.name}`)
            skipped++
          }
        } else {
          if (this.config.create_new_products) {
            if (!this.config.dry_run) {
              await this.bl('addInventoryProduct', {
                inventory_id: this.config.inventory_id,
                ...blData
              })
            }
            console.log(`   ✅ Created: ${sanityProduct.name}`)
            created++
          } else {
            console.log(`   ⏭️  Skipped new: ${sanityProduct.name}`)
            skipped++
          }
        }
      } catch (error) {
        console.error(`   ❌ Error processing ${sanityProduct.name}:`, error)
      }
    }

    console.log(`\n📊 Sync Summary:`)
    console.log(`   Created: ${created}`)
    console.log(`   Updated: ${updated}`)
    console.log(`   Skipped: ${skipped}`)
  }

  // Main sync method
  async sync(): Promise<void> {
    console.log('🚀 Starting Baselinker Sync System...')
    console.log(`   Mode: ${this.config.sync_direction}`)
    console.log(`   Dry run: ${this.config.dry_run}`)
    console.log(`   Inventory ID: ${this.config.inventory_id}`)
    console.log()

    switch (this.config.sync_direction) {
      case 'baselinker_to_sanity':
        await this.syncFromBaselinkerToSanity()
        break
      case 'sanity_to_baselinker':
        await this.syncFromSanityToBaselinker()
        break
      case 'bidirectional':
        console.log('🔄 Bidirectional sync not implemented yet')
        break
      default:
        throw new Error(`Unknown sync direction: ${this.config.sync_direction}`)
    }

    console.log('\n✅ Sync completed!')
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'help'

  if (command === 'help') {
    console.log(`
🔄 Baselinker Sync System

Usage: npm run sync:baselinker [command] [options]

Commands:
  check                    - Check current Baselinker inventory
  sync:bl-to-sanity        - Sync from Baselinker to Sanity
  sync:sanity-to-bl        - Sync from Sanity to Baselinker
  sync:bidirectional       - Bidirectional sync (not implemented)

Options:
  --dry-run               - Run without making changes
  --create-new            - Create new products (default: true)
  --update-existing       - Update existing products (default: true)
  --batch-size=100        - Batch size for processing (default: 100)

Examples:
  npm run sync:baselinker check
  npm run sync:baselinker sync:bl-to-sanity --dry-run
  npm run sync:baselinker sync:sanity-to-bl --create-new --update-existing
`)
    return
  }

  if (!process.env.BASELINKER_API_TOKEN) {
    console.error('❌ Missing BASELINKER_API_TOKEN environment variable')
    process.exit(1)
  }

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing SANITY_API_TOKEN environment variable')
    process.exit(1)
  }

  const dryRun = args.includes('--dry-run')
  const createNew = !args.includes('--no-create-new')
  const updateExisting = !args.includes('--no-update-existing')
  const batchSize = parseInt(args.find(arg => arg.startsWith('--batch-size='))?.split('=')[1] || '100')

  const config: SyncConfig = {
    inventory_id: parseInt(process.env.BASELINKER_INVENTORY_ID || '0'),
    price_group_id: 1, // Will be fetched dynamically
    sync_direction: command as any,
    dry_run: dryRun,
    batch_size: batchSize,
    create_missing_categories: true,
    update_existing_products: updateExisting,
    create_new_products: createNew
  }

  if (config.inventory_id === 0) {
    console.error('❌ Missing BASELINKER_INVENTORY_ID environment variable')
    process.exit(1)
  }

  try {
    if (command === 'check') {
      console.log('Use: npm run check:baselinker')
      console.log('This command checks the current Baselinker inventory.')
    } else {
      const syncSystem = new BaselinkerSyncSystem(config)
      await syncSystem.sync()
    }
  } catch (error) {
    console.error('❌ Sync failed:', error)
    process.exit(1)
  }
}

main()

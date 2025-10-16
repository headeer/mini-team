/* eslint-disable no-console */
import 'dotenv/config'
import { createClient } from 'next-sanity'

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-03-20',
  useCdn: true
})

async function testSanityProducts() {
  try {
    console.log('🔍 Fetching products from Sanity...\n')
    
    const query = `*[_type == 'product' && defined(slug.current) && defined(name)] | order(name asc) {
      _id,
      name,
      slug,
      description,
      priceNet,
      priceGross,
      priceOlx,
      stock,
      "categories": categories[]->{ title },
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
      "brand": brand->{ title },
      status,
      externalId,
      hidden,
      phoneOrderOnly,
      discount,
      images[]{..., "asset": select(defined(asset) => {"url": asset->url}, null), "externalImage": select(defined(externalImage) => externalImage, null)}
    }`
    
    const products = await sanityClient.fetch(query)
    
    console.log(`📊 Found ${products.length} products in Sanity\n`)
    
    if (products.length === 0) {
      console.log('❌ No products found in Sanity')
      return
    }
    
    // Show first 5 products as examples
    console.log('🔍 Sample products (first 5):\n')
    products.slice(0, 5).forEach((product: any, i: number) => {
      console.log(`${i + 1}. ${product.name}`)
      console.log(`   ID: ${product._id}`)
      console.log(`   Slug: ${product.slug?.current}`)
      console.log(`   Price Gross: ${product.priceGross || 'N/A'} PLN`)
      console.log(`   Price Net: ${product.priceNet || 'N/A'} PLN`)
      console.log(`   Stock: ${product.stock || 'N/A'}`)
      console.log(`   Categories: ${product.categories?.map((c: any) => c.title).join(', ') || 'N/A'}`)
      console.log(`   Brand: ${product.brand?.title || 'N/A'}`)
      console.log(`   Images: ${product.images?.length || 0}`)
      console.log(`   External ID: ${product.externalId || 'N/A'}`)
      console.log(`   Hidden: ${product.hidden ? 'Yes' : 'No'}`)
      console.log()
    })
    
    // Statistics
    console.log('📈 Product Statistics:')
    console.log(`   Total products: ${products.length}`)
    console.log(`   With prices: ${products.filter((p: any) => p.priceGross).length}`)
    console.log(`   With stock: ${products.filter((p: any) => typeof p.stock === 'number').length}`)
    console.log(`   With images: ${products.filter((p: any) => p.images && p.images.length > 0).length}`)
    console.log(`   With categories: ${products.filter((p: any) => p.categories && p.categories.length > 0).length}`)
    console.log(`   With external ID: ${products.filter((p: any) => p.externalId).length}`)
    console.log(`   Hidden: ${products.filter((p: any) => p.hidden).length}`)
    console.log(`   Phone order only: ${products.filter((p: any) => p.phoneOrderOnly).length}`)
    
    // Category breakdown
    const categoryCounts = new Map<string, number>()
    products.forEach((product: any) => {
      product.categories?.forEach((cat: any) => {
        const title = cat.title || 'Unknown'
        categoryCounts.set(title, (categoryCounts.get(title) || 0) + 1)
      })
    })
    
    if (categoryCounts.size > 0) {
      console.log('\n📂 Categories:')
      Array.from(categoryCounts.entries())
        .sort((a: any, b: any) => b[1] - a[1])
        .forEach(([category, count]: [string, number]) => {
          console.log(`   ${category}: ${count} products`)
        })
    }
    
    // Brand breakdown
    const brandCounts = new Map<string, number>()
    products.forEach((product: any) => {
      if (product.brand?.title) {
        brandCounts.set(product.brand.title, (brandCounts.get(product.brand.title) || 0) + 1)
      }
    })
    
    if (brandCounts.size > 0) {
      console.log('\n🏷️ Brands:')
      Array.from(brandCounts.entries())
        .sort((a: any, b: any) => b[1] - a[1])
        .forEach(([brand, count]: [string, number]) => {
          console.log(`   ${brand}: ${count} products`)
        })
    }
    
    // Price analysis
    const productsWithPrices = products.filter((p: any) => p.priceGross && p.priceGross > 0)
    if (productsWithPrices.length > 0) {
      const prices = productsWithPrices.map((p: any) => p.priceGross!).sort((a: any, b: any) => a - b)
      console.log('\n💰 Price Analysis:')
      console.log(`   Min price: ${Math.min(...prices).toFixed(2)} PLN`)
      console.log(`   Max price: ${Math.max(...prices).toFixed(2)} PLN`)
      console.log(`   Avg price: ${(prices.reduce((a: any, b: any) => a + b, 0) / prices.length).toFixed(2)} PLN`)
    }
    
    // Save to file for reference
    const fs = await import('fs')
    const filename = `exports/sanity-products-${new Date().toISOString().split('T')[0]}.json`
    fs.writeFileSync(filename, JSON.stringify(products, null, 2))
    console.log(`\n💾 Products saved to: ${filename}`)
    
  } catch (error) {
    console.error('❌ Error fetching products from Sanity:', error)
  }
}

testSanityProducts()

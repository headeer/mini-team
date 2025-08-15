import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Configure your Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN!,
  apiVersion: '2024-01-01',
});

async function checkAndRemoveGeneralCategories() {
  console.log('🔍 Sprawdzam wszystkie kategorie łyżek...\n');
  
  try {
    // Get all categories related to łyżki
    const categories = await client.fetch(`
      *[_type == "category" && (title match "*yżk*" || title match "*ysk*")]{
        _id,
        title,
        "slug": slug.current,
        "productCount": count(*[_type == "product" && references(^._id)])
      } | order(title)
    `);
    
    console.log(`Znaleziono ${categories.length} kategorii łyżek:\n`);
    
    // Show all categories first
    categories.forEach((cat: any) => {
      console.log(`📂 ${cat.title} (${cat.slug})`);
      console.log(`   ID: ${cat._id}`);
      console.log(`   Produkty: ${cat.productCount}`);
      console.log('');
    });
    
    // Identify general categories to remove (without tonnage specification)
    const generalCategories = categories.filter((cat: any) => {
      const title = cat.title.toLowerCase();
      const hasNoTonnage = !title.match(/\d+.*t/) && !title.match(/\d+\s*-\s*\d/);
      const isGeneral = (title.includes('kopiące') || title.includes('skarpowe')) && hasNoTonnage;
      return isGeneral;
    });
    
    console.log(`\n🎯 Kategorie do usunięcia (ogólne, bez tonażu):`);
    generalCategories.forEach((cat: any) => {
      console.log(`❌ ${cat.title} (${cat._id}) - ${cat.productCount} produktów`);
    });
    
    console.log(`\n✅ Kategorie do zachowania (z tonażem):`);
    const specificCategories = categories.filter((cat: any) => {
      const title = cat.title.toLowerCase();
      const hasTonnage = title.match(/\d+.*t/) || title.match(/\d+\s*-\s*\d/);
      return hasTonnage;
    });
    
    specificCategories.forEach((cat: any) => {
      console.log(`✅ ${cat.title} (${cat._id}) - ${cat.productCount} produktów`);
    });
    
    // Check if general categories have products assigned
    const categoriesWithProducts = generalCategories.filter((cat: any) => cat.productCount > 0);
    
    if (categoriesWithProducts.length > 0) {
      console.log(`\n⚠️  UWAGA: Te kategorie mają przypisane produkty i nie mogą być usunięte:`);
      categoriesWithProducts.forEach((cat: any) => {
        console.log(`   - ${cat.title}: ${cat.productCount} produktów`);
      });
      
      // Get products in these categories
      for (const cat of categoriesWithProducts) {
        console.log(`\n📦 Produkty w kategorii "${cat.title}":`);
        const products = await client.fetch(`
          *[_type == "product" && references($categoryId)]{
            _id,
            name,
            "slug": slug.current
          }
        `, { categoryId: cat._id });
        
        products.forEach((product: any) => {
          console.log(`   - ${product.name} (${product.slug})`);
        });
      }
      
      console.log(`\n💡 Najpierw musisz przenieść te produkty do konkretnych kategorii z tonażem.`);
    } else {
      console.log(`\n🗑️  Usuwam ogólne kategorie (bez produktów)...`);
      
      for (const cat of generalCategories) {
        try {
          await client.delete(cat._id);
          console.log(`   ✅ Usunięto: ${cat.title}`);
        } catch (error) {
          console.log(`   ❌ Błąd przy usuwaniu ${cat.title}: ${error}`);
        }
      }
      
      console.log(`\n🎉 Ukończono usuwanie ogólnych kategorii!`);
    }
    
  } catch (error) {
    console.error('❌ Błąd:', error);
  }
}

checkAndRemoveGeneralCategories();

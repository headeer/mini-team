import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Configure your Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN!, // Use write token if available, fallback to read token
  apiVersion: '2024-01-01',
});

const categories = [
  {
    _id: 'category-grabie',
    _type: 'category',
    title: 'Grabie',
    slug: {
      _type: 'slug',
      current: 'grabie'
    },
    description: 'Grabie do koparek - różne rozmiary i grubości zębów',
    featured: true,
    range: 1500
  },
  {
    _id: 'category-grabie-100cm-12mm',
    _type: 'category',
    title: 'Grabie 100cm • 12mm zęby',
    slug: {
      _type: 'slug',
      current: 'grabie-100cm-grubosc-zeba-12mm'
    },
    description: 'Grabie 100cm z zębami grubość 12mm - kompaktowe rozwiązanie',
    featured: true,
    range: 1500
  },
  {
    _id: 'category-grabie-100cm-15mm',
    _type: 'category',
    title: 'Grabie 100cm • 15mm zęby',
    slug: {
      _type: 'slug',
      current: 'grabie-100cm-grubosc-zeba-15mm'
    },
    description: 'Grabie 100cm z zębami grubość 15mm - wzmocniona wersja',
    featured: true,
    range: 1580
  },
  {
    _id: 'category-grabie-120cm-12mm',
    _type: 'category',
    title: 'Grabie 120cm • 12mm zęby',
    slug: {
      _type: 'slug',
      current: 'grabie-120cm-grubosc-zeba-12mm'
    },
    description: 'Grabie 120cm z zębami grubość 12mm - standardowe rozwiązanie',
    featured: true,
    range: 1650
  },
  {
    _id: 'category-grabie-120cm-15mm',
    _type: 'category',
    title: 'Grabie 120cm • 15mm zęby',
    slug: {
      _type: 'slug',
      current: 'grabie-120cm-grubosc-zeba-15mm'
    },
    description: 'Grabie 120cm z zębami grubość 15mm - najpopularniejszy model',
    featured: true,
    range: 1750
  }
];

async function importCategories() {
  console.log('🚀 Starting Grabie categories import...');
  
  try {
    for (const category of categories) {
      console.log(`📁 Creating category: ${category.title}`);
      
      const result = await client.createOrReplace(category);
      console.log(`✅ Created/Updated: ${result._id}`);
    }
    
    console.log('🎉 All Grabie categories imported successfully!');
    console.log('\n📋 Summary:');
    categories.forEach(cat => {
      console.log(`   • ${cat.title} (${cat.slug.current})`);
    });
    
  } catch (error) {
    console.error('❌ Error importing categories:', error);
  }
}

// Run the import
if (require.main === module) {
  importCategories();
}

export { importCategories, categories };

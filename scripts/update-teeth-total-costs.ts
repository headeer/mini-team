import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
  apiVersion: '2024-01-01',
});

// Correct total costs based on your pricing matrix
const teethTotalCosts = {
  // Łyżki kopiące — 1–1.5t
  '18cm': { toothQty: 2, toothCost: 240 }, // 2 × 120 = 240
  '20cm': { toothQty: 2, toothCost: 240 }, // 2 × 120 = 240
  '23cm': { toothQty: 2, toothCost: 240 }, // 2 × 120 = 240
  '25cm': { toothQty: 2, toothCost: 240 }, // 2 × 120 = 240
  '27cm': { toothQty: 3, toothCost: 360 }, // 3 × 120 = 360
  '30cm': { toothQty: 3, toothCost: 480 }, // 3 × 160 = 480
  '40cm': { toothQty: 3, toothCost: 480 }, // 3 × 160 = 480
  '45cm': { toothQty: 4, toothCost: 800 }, // 4 × 200 = 800
  '50cm': { toothQty: 4, toothCost: 800 }, // 4 × 200 = 800
  '60cm': { toothQty: 5, toothCost: 1200 }, // 5 × 240 = 1200
  '70cm': { toothQty: 5, toothCost: 1200 }, // 5 × 240 = 1200
  
  // Łyżki kopiące — 1.5–2.3t
  '25cm': { toothQty: 2, toothCost: 240 }, // 2 × 120 = 240
  '30cm': { toothQty: 3, toothCost: 480 }, // 3 × 160 = 480
  '40cm': { toothQty: 3, toothCost: 480 }, // 3 × 160 = 480
  '45cm': { toothQty: 4, toothCost: 800 }, // 4 × 200 = 800
  '50cm': { toothQty: 4, toothCost: 800 }, // 4 × 200 = 800
  '60cm': { toothQty: 5, toothCost: 1200 }, // 5 × 240 = 1200
  
  // Łyżki kopiące — 2.3–3t
  '25cm': { toothQty: 2, toothCost: 240 }, // 2 × 120 = 240
  '30cm': { toothQty: 3, toothCost: 480 }, // 3 × 160 = 480
  '40cm': { toothQty: 3, toothCost: 480 }, // 3 × 160 = 480
  '45cm': { toothQty: 4, toothCost: 800 }, // 4 × 200 = 800
  '50cm': { toothQty: 4, toothCost: 800 }, // 4 × 200 = 800
  '60cm': { toothQty: 5, toothCost: 1200 }, // 5 × 240 = 1200
  '80cm': { toothQty: 6, toothCost: 1620 }, // 6 × 270 = 1620
  
  // Łyżki kopiące — 3–5t
  '25cm': { toothQty: 2, toothCost: 260 }, // 2 × 130 = 260
  '30cm': { toothQty: 3, toothCost: 495 }, // 3 × 165 = 495
  '35cm': { toothQty: 3, toothCost: 495 }, // 3 × 165 = 495
  '40cm': { toothQty: 3, toothCost: 495 }, // 3 × 165 = 495
  '45cm': { toothQty: 3, toothCost: 495 }, // 3 × 165 = 495
  '50cm': { toothQty: 4, toothCost: 800 }, // 4 × 200 = 800
  '60cm': { toothQty: 4, toothCost: 800 }, // 4 × 200 = 800
  '70cm': { toothQty: 4, toothCost: 940 }, // 4 × 235 = 940
  '80cm': { toothQty: 4, toothCost: 940 }, // 4 × 235 = 940
  '90cm': { toothQty: 5, toothCost: 1350 }, // 5 × 270 = 1350
  '100cm': { toothQty: 5, toothCost: 1350 }, // 5 × 270 = 1350
};

async function updateTeethTotalCosts() {
  try {
    console.log('🔍 Fetching all products with teeth data...');
    
    const products = await client.fetch(`
      *[_type == "product" && defined(name) && (name match "*łyżk*" || name match "*lyzk*") && defined(toothCost) && defined(toothQty)] {
        _id,
        name,
        toothCost,
        toothQty
      }
    `);
    
    console.log(`📦 Found ${products.length} products with teeth data`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      const name = product.name.toLowerCase();
      
      // Extract size from product name
      const sizeMatch = name.match(/(\d+)cm/);
      if (!sizeMatch) {
        console.log(`⚠️  No size found for: ${product.name}`);
        continue;
      }
      
      const size = sizeMatch[1] + 'cm';
      const correctData = teethTotalCosts[size as keyof typeof teethTotalCosts];
      
      if (!correctData) {
        console.log(`⚠️  No teeth data for size ${size} in: ${product.name}`);
        continue;
      }
      
      // Check if update is needed
      if (product.toothCost === correctData.toothCost && product.toothQty === correctData.toothQty) {
        console.log(`✅ Already correct: ${product.name} (${size}) - ${product.toothCost} zł for ${product.toothQty} szt`);
        continue;
      }
      
      console.log(`🔄 Updating: ${product.name} (${size})`);
      console.log(`   Old: toothCost=${product.toothCost}, toothQty=${product.toothQty}`);
      console.log(`   New: toothCost=${correctData.toothCost}, toothQty=${correctData.toothQty}`);
      
      await client
        .patch(product._id)
        .set({
          toothCost: correctData.toothCost,
          toothQty: correctData.toothQty
        })
        .commit();
      
      updatedCount++;
    }
    
    console.log(`\n✅ Updated ${updatedCount} products with correct teeth total costs`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateTeethTotalCosts();

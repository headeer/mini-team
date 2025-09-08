import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

const repoRoot = path.resolve(__dirname, '..');

async function uploadImage(filePath: string, filename: string) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const asset = await client.assets.upload('image', fileBuffer, {
      filename: filename,
    });
    console.log(`✅ Uploaded image: ${filename} (${asset._id})`);
    return asset;
  } catch (error) {
    console.error(`❌ Failed to upload image ${filename}:`, error);
    return null;
  }
}

function getCategoryFromProduct(product: any): string {
  const name = product.name.toLowerCase();
  
  // Determine weight category - check for various patterns
  if (name.includes('1-1.5t') || name.includes('1–1.5t') || name.includes('(1-2t)') || name.includes('(1–2t)')) return '1-1.5t';
  if (name.includes('1.5-2.3t') || name.includes('1.5–2.3t') || name.includes('(1.5-2.3t)') || name.includes('(1.5–2.3t)')) return '1.5-2.3t';
  if (name.includes('2.3-3t') || name.includes('2.3–3t') || name.includes('(2-3t)') || name.includes('(2–3t)') || name.includes('(2.3-3t)') || name.includes('(2.3–3t)')) return '2.3-3t';
  if (name.includes('3-5t') || name.includes('3–5t') || name.includes('(3-5t)') || name.includes('(3–5t)') || name.includes('(3-4.5t)') || name.includes('(3–4.5t)')) return '3-5t';
  
  return 'unknown';
}

function getProductType(product: any): 'kopiąca' | 'skarpowa' {
  const name = product.name.toLowerCase();
  return name.includes('skarpowa') ? 'skarpowa' : 'kopiąca';
}

async function updateAllLyzkiDrawings() {
  try {
    console.log('🔍 Finding all łyżki products...');
    
    // Find all products that are łyżki (kopiące or skarpowe)
    const products = await client.fetch(`*[_type == "product" && (name match "*łyżka*" || name match "*Łyżka*")]`);
    
    if (products.length === 0) {
      console.log('❌ No łyżki products found');
      return;
    }
    
    console.log(`✅ Found ${products.length} łyżki products`);
    
    // Group products by category and type
    const productGroups: { [key: string]: any[] } = {};
    
    products.forEach(product => {
      const category = getCategoryFromProduct(product);
      const type = getProductType(product);
      const key = `${category}-${type}`;
      
      if (!productGroups[key]) {
        productGroups[key] = [];
      }
      productGroups[key].push(product);
    });
    
    console.log('\n📊 Product groups:');
    Object.keys(productGroups).forEach(key => {
      console.log(`   ${key}: ${productGroups[key].length} products`);
    });
    
    // Define technical drawings mapping
    const drawingsMap = {
      '1-1.5t': {
        kopiąca: {
          title: 'Rysunek techniczny 1-1.5t kopiąca',
          code: 'LYZKA_1_1_5T_KOPIACA',
          imagePath: path.join(repoRoot, 'images/rys_tech_lyzki/lyzki_1-1.5t_techniczny1.png'),
          imageFilename: 'lyzki_1-1.5t_techniczny1.png'
        },
        skarpowa: {
          title: 'Rysunek techniczny 1-1.5t skarpowa',
          code: 'LYZKA_1_1_5T_SKARPOWA',
          imagePath: path.join(repoRoot, 'images/rys_tech_lyzki/lyzki_1-1.5t_techniczny2.png'),
          imageFilename: 'lyzki_1-1.5t_techniczny2.png'
        }
      },
      '1.5-2.3t': {
        kopiąca: {
          title: 'Rysunek techniczny 1.5-2.3t kopiąca',
          code: 'LYZKA_1_5_2_3T_KOPIACA',
          imagePath: path.join(repoRoot, 'images/rys_tech_lyzki/lyzki_1.5-2.3t_techniczny1.png'),
          imageFilename: 'lyzki_1.5-2.3t_techniczny1.png'
        },
        skarpowa: {
          title: 'Rysunek techniczny 1.5-2.3t skarpowa',
          code: 'LYZKA_1_5_2_3T_SKARPOWA',
          imagePath: path.join(repoRoot, 'images/rys_tech_lyzki/lyzki_1.5-2.3t_techniczny2.png'),
          imageFilename: 'lyzki_1.5-2.3t_techniczny2.png'
        }
      },
      '2.3-3t': {
        kopiąca: {
          title: 'Rysunek techniczny 2.3-3t kopiąca',
          code: 'LYZKA_2_3_3T_KOPIACA',
          imagePath: path.join(repoRoot, 'images/rys_tech_lyzki/lyzki_2.3-3t_techniczny1.png'),
          imageFilename: 'lyzki_2.3-3t_techniczny1.png'
        },
        skarpowa: {
          title: 'Rysunek techniczny 2.3-3t skarpowa',
          code: 'LYZKA_2_3_3T_SKARPOWA',
          imagePath: path.join(repoRoot, 'images/rys_tech_lyzki/lyzki_2.3-3t_techniczny2.png'),
          imageFilename: 'lyzki_2.3-3t_techniczny2.png'
        }
      },
      '3-5t': {
        kopiąca: {
          title: 'Rysunek techniczny 3-5t kopiąca',
          code: 'LYZKA_3_5T_KOPIACA',
          imagePath: path.join(repoRoot, 'images/rys_tech_lyzki/lyzki_3-5t_techniczny1.png'),
          imageFilename: 'lyzki_3-5t_techniczny1.png'
        },
        skarpowa: {
          title: 'Rysunek techniczny 3-5t skarpowa',
          code: 'LYZKA_3_5T_SKARPOWA',
          imagePath: path.join(repoRoot, 'images/rys_tech_lyzki/lyzki_3-5t_techniczny2.png'),
          imageFilename: 'lyzki_3-5t_techniczny2.png'
        }
      }
    };
    
    // Check if all image files exist
    console.log('\n🔍 Checking image files...');
    for (const category of Object.keys(drawingsMap)) {
      for (const type of Object.keys(drawingsMap[category])) {
        const drawing = drawingsMap[category][type];
        if (!fs.existsSync(drawing.imagePath)) {
          console.log(`❌ Image file not found: ${drawing.imagePath}`);
          return;
        }
        console.log(`✅ Found: ${drawing.imageFilename}`);
      }
    }
    
    // Upload all images and create technical drawings
    console.log('\n📤 Uploading technical drawings...');
    const uploadedDrawings: { [key: string]: any } = {};
    
    for (const category of Object.keys(drawingsMap)) {
      uploadedDrawings[category] = {};
      for (const type of Object.keys(drawingsMap[category])) {
        const drawing = drawingsMap[category][type];
        const imageAsset = await uploadImage(drawing.imagePath, drawing.imageFilename);
        if (!imageAsset) continue;
        
        uploadedDrawings[category][type] = {
          _type: 'object',
          title: drawing.title,
          code: drawing.code,
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imageAsset._id
            }
          }
        };
      }
    }
    
    // Update products
    console.log('\n📝 Updating products with correct technical drawings...');
    let updatedCount = 0;
    
    for (const [groupKey, groupProducts] of Object.entries(productGroups)) {
      console.log(`\n🔍 Processing group: ${groupKey}`);
      
      // Parse the group key properly
      let fullCategory = '';
      let type = '';
      
      if (groupKey.includes('1-1.5t')) {
        fullCategory = '1-1.5t';
        type = groupKey.replace('1-1.5t-', '');
      } else if (groupKey.includes('1.5-2.3t')) {
        fullCategory = '1.5-2.3t';
        type = groupKey.replace('1.5-2.3t-', '');
      } else if (groupKey.includes('2.3-3t')) {
        fullCategory = '2.3-3t';
        type = groupKey.replace('2.3-3t-', '');
      } else if (groupKey.includes('3-5t')) {
        fullCategory = '3-5t';
        type = groupKey.replace('3-5t-', '');
      } else {
        console.log(`⚠️  Unknown group key format: ${groupKey}`);
        continue;
      }
      
      console.log(`   Category: ${fullCategory}, Type: ${type}`);
      
      if (!uploadedDrawings[fullCategory] || !uploadedDrawings[fullCategory][type]) {
        console.log(`⚠️  No technical drawing found for ${groupKey} (${fullCategory}-${type})`);
        continue;
      }
      
      const technicalDrawing = uploadedDrawings[fullCategory][type];
      
      console.log(`\n🔄 Updating ${groupProducts.length} products in ${groupKey}:`);
      
      for (let i = 0; i < groupProducts.length; i++) {
        const product = groupProducts[i];
        
        try {
          await client
            .patch(product._id)
            .set({
              technicalDrawings: [technicalDrawing]
            })
            .commit();
          
          console.log(`   ✅ ${i + 1}/${groupProducts.length}: ${product.name}`);
          updatedCount++;
        } catch (error) {
          console.error(`   ❌ Failed to update ${product.name}:`, error);
        }
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} products with correct technical drawings!`);
    console.log('\n📊 Summary by category:');
    Object.keys(drawingsMap).forEach(category => {
      console.log(`   ${category}:`);
      Object.keys(drawingsMap[category]).forEach(type => {
        const drawing = drawingsMap[category][type];
        console.log(`     ${type}: ${drawing.title} (${drawing.code})`);
      });
    });
    
  } catch (error) {
    console.error('❌ Error updating łyżki drawings:', error);
  }
}

// Run the script
updateAllLyzkiDrawings();

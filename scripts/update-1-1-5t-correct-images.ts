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

async function update1_1_5tCorrectImages() {
  try {
    console.log('🔍 Finding all 1-1.5t products...');
    
    // Find all products with "1-1.5t" or "1–1.5t" in the name
    const products = await client.fetch(`*[_type == "product" && (name match "*1-1.5t*" || name match "*1–1.5t*" || name match "*(1-2t)*")]`);
    
    if (products.length === 0) {
      console.log('❌ No 1-1.5t products found');
      return;
    }
    
    console.log(`✅ Found ${products.length} 1-1.5t products:`);
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} (${product._id})`);
    });
    
    // Define image mapping based on cm measurements and product type
    const imageMapping = [
      {
        cm: 18,
        type: 'kopiąca',
        imagePath: path.join(repoRoot, 'images/lyzki/1-1.5t/tinywow_lyzka_18cm_84002143.webp'),
        imageFilename: 'tinywow_lyzka_18cm_84002143.webp'
      },
      {
        cm: 20,
        type: 'kopiąca',
        imagePath: path.join(repoRoot, 'images/lyzki/1-1.5t/tinywow_lyzka_20cm_84002143.webp'),
        imageFilename: 'tinywow_lyzka_20cm_84002143.webp'
      },
      {
        cm: 23,
        type: 'kopiąca',
        imagePath: path.join(repoRoot, 'images/lyzki/1-1.5t/tinywow_lyzka_23cm_84002143.webp'),
        imageFilename: 'tinywow_lyzka_23cm_84002143.webp'
      },
      {
        cm: 25,
        type: 'kopiąca',
        imagePath: path.join(repoRoot, 'images/lyzki/1-1.5t/tinywow_lyzka_25cm_84002112.webp'),
        imageFilename: 'tinywow_lyzka_25cm_84002112.webp'
      },
      {
        cm: 27,
        type: 'kopiąca',
        imagePath: path.join(repoRoot, 'images/lyzki/1-1.5t/tinywow_lyzka_27cm_84002143.webp'),
        imageFilename: 'tinywow_lyzka_27cm_84002143.webp'
      },
      {
        cm: 30,
        type: 'kopiąca',
        imagePath: path.join(repoRoot, 'images/lyzki/1-1.5t/tinywow_lyzka_30cm_84002112.webp'),
        imageFilename: 'tinywow_lyzka_30cm_84002112.webp'
      },
      {
        cm: 40,
        type: 'kopiąca',
        imagePath: path.join(repoRoot, 'images/lyzki/1-1.5t/tinywow_lyzka_40cm_84002112.webp'),
        imageFilename: 'tinywow_lyzka_40cm_84002112.webp'
      },
      {
        cm: 45,
        type: 'kopiąca',
        imagePath: path.join(repoRoot, 'images/lyzki/1-1.5t/tinywow_lyzka_45cm_84002112.webp'),
        imageFilename: 'tinywow_lyzka_45cm_84002112.webp'
      },
      {
        cm: 50,
        type: 'kopiąca',
        imagePath: path.join(repoRoot, 'images/lyzki/1-1.5t/tinywow_lyzka_50cm_84002112.webp'),
        imageFilename: 'tinywow_lyzka_50cm_84002112.webp'
      },
      {
        cm: 70,
        type: 'kopiąca',
        imagePath: path.join(repoRoot, 'images/lyzki/1-1.5t/tinywow_lyzka_70cm_84002143.webp'),
        imageFilename: 'tinywow_lyzka_70cm_84002143.webp'
      },
      {
        cm: 80,
        type: 'skarpowa',
        imagePath: path.join(repoRoot, 'images/lyzki/1-1.5t/tinywow_lyzka_skaropowa_80cm_84002143.webp'),
        imageFilename: 'tinywow_lyzka_skaropowa_80cm_84002143.webp'
      },
      {
        cm: 90,
        type: 'skarpowa',
        imagePath: path.join(repoRoot, 'images/lyzki/1-1.5t/tinywow_lyzka_skaropowa_90cm_84002143.webp'),
        imageFilename: 'tinywow_lyzka_skaropowa_90cm_84002143.webp'
      }
    ];
    
    // Check if image files exist
    console.log('\n🔍 Checking image files...');
    for (const mapping of imageMapping) {
      if (!fs.existsSync(mapping.imagePath)) {
        console.log(`❌ Image file not found: ${mapping.imagePath}`);
        return;
      }
      console.log(`✅ Found: ${mapping.imageFilename}`);
    }
    
    // Upload all images
    console.log('\n📤 Uploading images...');
    const uploadedImages: { [key: string]: any } = {};
    
    for (const mapping of imageMapping) {
      const imageAsset = await uploadImage(mapping.imagePath, mapping.imageFilename);
      if (imageAsset) {
        const key = `${mapping.cm}cm-${mapping.type}`;
        uploadedImages[key] = imageAsset;
      }
    }
    
    // Update products with matching cm measurements and type
    console.log('\n📝 Updating products with correct 1-1.5t images...');
    let updatedCount = 0;
    
    for (const product of products) {
      // Extract cm measurement from product name
      const name = product.name;
      const cmMatch = name.match(/(\d+)cm/);
      
      if (!cmMatch) {
        console.log(`⚠️  No cm measurement found in: ${name}`);
        continue;
      }
      
      const cm = parseInt(cmMatch[1]);
      const isSkarpowa = name.toLowerCase().includes('skarpowa');
      const type = isSkarpowa ? 'skarpowa' : 'kopiąca';
      const key = `${cm}cm-${type}`;
      const imageAsset = uploadedImages[key];
      
      if (!imageAsset) {
        console.log(`⚠️  No image found for ${cm}cm ${type}: ${name}`);
        continue;
      }
      
      try {
        await client
          .patch(product._id)
          .set({
            images: [{
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: imageAsset._id
              }
            }]
          })
          .commit();
        
        console.log(`✅ Updated: ${name} (${cm}cm ${type}) → ${imageAsset.originalFilename}`);
        updatedCount++;
      } catch (error) {
        console.error(`❌ Failed to update ${name}:`, error);
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} products with correct 1-1.5t images!`);
    
  } catch (error) {
    console.error('❌ Error updating 1-1.5t images:', error);
  }
}

// Run the script
update1_1_5tCorrectImages();

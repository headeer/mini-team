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

async function update1_5_2_3tAnd2_3_3tImages() {
  try {
    console.log('🔍 Finding all 1.5-2.3t and 2.3-3t products...');
    
    // Find all products with these weight categories
    const products = await client.fetch(`*[_type == "product" && (name match "*1.5-2.3t*" || name match "*1.5–2.3t*" || name match "*2.3-3t*" || name match "*2.3–3t*" || name match "*(2-3t)*")]`);
    
    if (products.length === 0) {
      console.log('❌ No 1.5-2.3t or 2.3-3t products found');
      return;
    }
    
    console.log(`✅ Found ${products.length} products:`);
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} (${product._id})`);
    });
    
    // Define image mapping based on cm measurements (same as 1-1.5t)
    const imageMapping = [
      {
        cm: 25,
        imagePath: path.join(repoRoot, 'images/lyzki/1.5-3t/Łyżka 25cm-min.webp'),
        imageFilename: 'Łyżka 25cm-min.webp'
      },
      {
        cm: 30,
        imagePath: path.join(repoRoot, 'images/lyzki/1.5-3t/Łyżka 30cm-min.webp'),
        imageFilename: 'Łyżka 30cm-min.webp'
      },
      {
        cm: 40,
        imagePath: path.join(repoRoot, 'images/lyzki/1.5-3t/Łyżka 40cm-min.webp'),
        imageFilename: 'Łyżka 40cm-min.webp'
      },
      {
        cm: 45,
        imagePath: path.join(repoRoot, 'images/lyzki/1.5-3t/łyżka 45cm-min.webp'),
        imageFilename: 'łyżka 45cm-min.webp'
      },
      {
        cm: 50,
        imagePath: path.join(repoRoot, 'images/lyzki/1.5-3t/łyżka 50cm-min.webp'),
        imageFilename: 'łyżka 50cm-min.webp'
      },
      {
        cm: 60,
        imagePath: path.join(repoRoot, 'images/lyzki/1.5-3t/Łyżka 60cm-min.webp'),
        imageFilename: 'Łyżka 60cm-min.webp'
      },
      {
        cm: 80,
        imagePath: path.join(repoRoot, 'images/lyzki/1.5-3t/Łyżka 80cm-min.webp'),
        imageFilename: 'Łyżka 80cm-min.webp'
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
    const uploadedImages: { [key: number]: any } = {};
    
    for (const mapping of imageMapping) {
      const imageAsset = await uploadImage(mapping.imagePath, mapping.imageFilename);
      if (imageAsset) {
        uploadedImages[mapping.cm] = imageAsset;
      }
    }
    
    // Update products with matching cm measurements
    console.log('\n📝 Updating products with matching images...');
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
      const imageAsset = uploadedImages[cm];
      
      if (!imageAsset) {
        console.log(`⚠️  No image found for ${cm}cm: ${name}`);
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
        
        console.log(`✅ Updated: ${name} (${cm}cm) → ${imageAsset.originalFilename}`);
        updatedCount++;
      } catch (error) {
        console.error(`❌ Failed to update ${name}:`, error);
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} products with new 1.5-3t images!`);
    
  } catch (error) {
    console.error('❌ Error updating 1.5-2.3t and 2.3-3t images:', error);
  }
}

// Run the script
update1_5_2_3tAnd2_3_3tImages();

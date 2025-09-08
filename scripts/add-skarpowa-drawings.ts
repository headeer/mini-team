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

async function addSkarpowaDrawings() {
  try {
    console.log('🔍 Finding all skarpowa products...');
    
    // Find all products with "skarpowa" in the name
    const products = await client.fetch(`*[_type == "product" && name match "*skarpowa*"]`);
    
    if (products.length === 0) {
      console.log('❌ No skarpowa products found');
      return;
    }
    
    console.log(`✅ Found ${products.length} skarpowa products:`);
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} (${product._id})`);
    });
    
    // Define the technical drawings to add
    const drawings = [
      {
        title: 'Rysunek techniczny skarpowa',
        code: 'SKARPOWA_1',
        imagePath: path.join(repoRoot, 'public/images/rys_techniczne/lyska_skarpowa.png'),
        imageFilename: 'lyska_skarpowa.png'
      },
      {
        title: 'Rysunek techniczny skarpowa 2',
        code: 'SKARPOWA_2',
        imagePath: path.join(repoRoot, 'public/images/rys_techniczne/lyska_skarpowa_2.png'),
        imageFilename: 'lyska_skarpowa_2.png'
      }
    ];
    
    // Check if image files exist
    for (const drawing of drawings) {
      if (!fs.existsSync(drawing.imagePath)) {
        console.log(`❌ Image file not found: ${drawing.imagePath}`);
        return;
      }
    }
    
    console.log('📤 Uploading technical drawings...');
    
    const technicalDrawings = [];
    
    for (const drawing of drawings) {
      // Upload image
      const imageAsset = await uploadImage(drawing.imagePath, drawing.imageFilename);
      if (!imageAsset) continue;
      
      // Create technical drawing object
      technicalDrawings.push({
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
      });
    }
    
    if (technicalDrawings.length === 0) {
      console.log('❌ No technical drawings were uploaded');
      return;
    }
    
    console.log(`📝 Adding ${technicalDrawings.length} technical drawings to ${products.length} skarpowa products...`);
    
    // Update each product with technical drawings
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      try {
        await client
          .patch(product._id)
          .set({
            technicalDrawings: technicalDrawings
          })
          .commit();
        
        console.log(`✅ Updated ${i + 1}/${products.length}: ${product.name}`);
      } catch (error) {
        console.error(`❌ Failed to update ${product.name}:`, error);
      }
    }
    
    console.log('🎉 Successfully added technical drawings to all skarpowa products!');
    console.log(`📊 Added ${technicalDrawings.length} technical drawings to ${products.length} products:`);
    technicalDrawings.forEach((drawing, index) => {
      console.log(`   ${index + 1}. ${drawing.title} (${drawing.code})`);
    });
    
  } catch (error) {
    console.error('❌ Error adding skarpowa drawings:', error);
  }
}

// Run the script
addSkarpowaDrawings();

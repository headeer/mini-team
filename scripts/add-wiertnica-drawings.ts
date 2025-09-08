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

async function uploadPDF(filePath: string, filename: string) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const asset = await client.assets.upload('file', fileBuffer, {
      filename: filename,
    });
    console.log(`✅ Uploaded PDF: ${filename} (${asset._id})`);
    return asset;
  } catch (error) {
    console.error(`❌ Failed to upload PDF ${filename}:`, error);
    return null;
  }
}

async function addWiertnicaDrawings() {
  try {
    console.log('🔍 Finding Wiertnica glebowa product...');
    
    // Find the wiertnica product
    const products = await client.fetch(`*[_type == "product" && name match "*Wiertnica glebowa*"]`);
    
    if (products.length === 0) {
      console.log('❌ No Wiertnica glebowa product found');
      return;
    }
    
    const product = products[0];
    console.log(`✅ Found product: ${product.name} (${product._id})`);
    
    // Define the technical drawings to add
    const drawings = [
      {
        title: 'Wahacz gięty',
        code: 'MS01',
        imagePath: path.join(repoRoot, 'images/techniczne/png/rysunek_techniczny_wahacza_gietego-1.png'),
        pdfPath: path.join(repoRoot, 'public/images/techniczne/rysunek_techniczny_wahacza_gietego.pdf'),
        imageFilename: 'rysunek_techniczny_wahacza_gietego-1.png',
        pdfFilename: 'rysunek_techniczny_wahacza_gietego.pdf'
      },
      {
        title: 'Wahacz kostka',
        code: 'MS03',
        imagePath: path.join(repoRoot, 'images/techniczne/png/rysunek_techniczny_wahacz_kostka-1.png'),
        pdfPath: path.join(repoRoot, 'public/images/techniczne/rysunek_techniczny_wahacz_kostka.pdf'),
        imageFilename: 'rysunek_techniczny_wahacz_kostka-1.png',
        pdfFilename: 'rysunek_techniczny_wahacz_kostka.pdf'
      },
      {
        title: 'Premium',
        code: 'CW05',
        imagePath: path.join(repoRoot, 'images/techniczne/png/rysunek_techniczny_premium-1.png'),
        pdfPath: path.join(repoRoot, 'public/images/techniczne/rysunek_techniczny_premium.pdf'),
        imageFilename: 'rysunek_techniczny_premium-1.png',
        pdfFilename: 'rysunek_techniczny_premium.pdf'
      }
    ];
    
    console.log('📤 Uploading technical drawings...');
    
    const technicalDrawings = [];
    
    for (const drawing of drawings) {
      // Check if files exist
      if (!fs.existsSync(drawing.imagePath)) {
        console.log(`⚠️ Image file not found: ${drawing.imagePath}`);
        continue;
      }
      
      if (!fs.existsSync(drawing.pdfPath)) {
        console.log(`⚠️ PDF file not found: ${drawing.pdfPath}`);
        continue;
      }
      
      // Upload image
      const imageAsset = await uploadImage(drawing.imagePath, drawing.imageFilename);
      if (!imageAsset) continue;
      
      // Upload PDF
      const pdfAsset = await uploadPDF(drawing.pdfPath, drawing.pdfFilename);
      if (!pdfAsset) continue;
      
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
        },
        file: {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: pdfAsset._id
          }
        }
      });
    }
    
    if (technicalDrawings.length === 0) {
      console.log('❌ No technical drawings were uploaded');
      return;
    }
    
    console.log(`📝 Adding ${technicalDrawings.length} technical drawings to product...`);
    
    // Update the product with technical drawings
    await client
      .patch(product._id)
      .set({
        technicalDrawings: technicalDrawings
      })
      .commit();
    
    console.log('✅ Successfully added technical drawings to Wiertnica glebowa!');
    console.log(`📊 Added ${technicalDrawings.length} technical drawings:`);
    technicalDrawings.forEach((drawing, index) => {
      console.log(`   ${index + 1}. ${drawing.title} (${drawing.code})`);
    });
    
  } catch (error) {
    console.error('❌ Error adding technical drawings:', error);
  }
}

// Run the script
addWiertnicaDrawings();

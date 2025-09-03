import fs from 'fs';
import path from 'path';

// Load the products.json file
const productsPath = path.join(process.cwd(), 'data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Mapping of product categories to their technical drawings
const technicalDrawingMap = {
  'category-grabie-100cm-12mm': '/images/techniczne/grabie_100cm_grubosc_zeba_12mm.pdf',
  'category-grabie-100cm-15mm': '/images/techniczne/grabie_100cm_grubosc_zeba_15mm.pdf',
  'category-grabie-120cm-12mm': '/images/techniczne/grabie_120cm_12mm.pdf',
  'category-grabie-120cm-15mm': '/images/techniczne/grabie_120cm_15mm.pdf',
};

console.log('🔧 Adding technical drawings to Grabie products...\n');

let updatedCount = 0;

// Update each product
products.forEach((product: any, index: number) => {
  // Check if this product has a Grabie category
  const grabieCategory = product.categories?.find((cat: any) => 
    cat._ref && technicalDrawingMap[cat._ref as keyof typeof technicalDrawingMap]
  );
  
  if (grabieCategory) {
    const categoryRef = grabieCategory._ref;
    const technicalDrawingUrl = technicalDrawingMap[categoryRef as keyof typeof technicalDrawingMap];
    
    console.log(`📄 Adding technical drawing to: ${product.name}`);
    console.log(`   → Category: ${categoryRef}`);
    console.log(`   → Drawing: ${technicalDrawingUrl}`);
    
    // Add technical drawing field to the product (legacy)
    product.technicalDrawing = {
      url: technicalDrawingUrl,
      title: `Rysunek techniczny - ${product.name}`,
      type: 'pdf'
    };
    // And new array-based field for multiple drawings
    (product as any).technicalDrawings = [
      {
        _type: 'object',
        title: `Rysunek techniczny - ${product.name}`,
        externalUrl: technicalDrawingUrl,
      },
    ];
    
    // Also add to specifications if it exists
    if (product.specifications) {
      product.specifications.technicalDrawing = technicalDrawingUrl;
    }
    
    updatedCount++;
    console.log(`   ✅ Updated\n`);
  }
});

// Save the updated products.json
fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

console.log(`🎉 Successfully updated ${updatedCount} Grabie products with technical drawings!`);
console.log('\n📋 Summary:');
console.log('- Grabie 100cm • 12mm zęby → grabie_100cm_grubosc_zeba_12mm.pdf');
console.log('- Grabie 100cm • 15mm zęby → grabie_100cm_grubosc_zeba_15mm.pdf');
console.log('- Grabie 120cm • 12mm zęby → grabie_120cm_12mm.pdf');
console.log('- Grabie 120cm • 15mm zęby → grabie_120cm_15mm.pdf');
console.log('\n💡 Next step: Update Sanity with the new product data using:');
console.log('npx tsx scripts/import-products-from-json.ts && npx sanity dataset import .sanity-import/products.ndjson production --replace');

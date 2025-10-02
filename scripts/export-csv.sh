#!/bin/bash

# Export products to CSV for Baselinker import
echo "🔄 Exporting products to CSV for Baselinker..."

# Run the TypeScript export script
npx tsx scripts/export-products-to-csv.ts

echo "✅ Export completed!"
echo "📁 Check the exports/ directory for the CSV files"
echo "🌐 Or visit /api/products/export-csv to download directly"


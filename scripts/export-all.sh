#!/bin/bash

# Export all products to CSV formats for Baselinker import
echo "🔄 Exporting all products to CSV formats..."

echo "📦 1. Exporting Baselinker format (basic)..."
npx tsx scripts/export-products-to-csv.ts

echo ""
echo "📊 2. Exporting comprehensive format (all parameters)..."
npx tsx scripts/export-comprehensive-csv.ts

echo ""
echo "✅ All exports completed!"
echo ""
echo "📁 Files created in exports/ directory:"
echo "   - baselinker-products.csv (basic Baselinker format)"
echo "   - comprehensive-products-*.csv (all parameters)"
echo "   - baselinker-comprehensive-*.csv (comprehensive Baselinker format)"
echo ""
echo "🌐 Or download directly via API:"
echo "   - /api/products/export-csv (basic format)"
echo "   - /api/products/export-comprehensive (comprehensive format)"


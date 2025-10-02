# Product Export Files

This directory contains CSV exports of all products for Baselinker import.

## Available Exports

### 1. Basic Baselinker Format (`baselinker-products.csv`)
- **Purpose**: Standard Baselinker import format
- **Columns**: 32 columns including basic product info, pricing, images, and key parameters
- **Use case**: Quick import to Baselinker with essential data

### 2. Comprehensive Format (`comprehensive-products-*.csv`)
- **Purpose**: Complete export with all available parameters
- **Columns**: 76 columns including all product data, specifications, technical drawings, mount systems, etc.
- **Use case**: Full data migration, analysis, or custom integrations

### 3. Baselinker Comprehensive (`baselinker-comprehensive-*.csv`)
- **Purpose**: Comprehensive data in Baselinker-compatible format
- **Columns**: Same as comprehensive format but optimized for Baselinker
- **Use case**: Advanced Baselinker import with all parameters

## How to Export

### Command Line
```bash
# Export basic format only
npx tsx scripts/export-products-to-csv.ts

# Export comprehensive format only
npx tsx scripts/export-comprehensive-csv.ts

# Export both formats
./scripts/export-all.sh
```

### API Endpoints
- **Basic format**: `/api/products/export-csv`
- **Comprehensive format**: `/api/products/export-comprehensive`

## File Structure

### Basic Format Columns
- `product_id`, `name`, `description_html`
- `price_gross`, `vat`, `quantity`
- `category_path`
- `image_url_1` through `image_url_10`
- `param_WeightRange`, `param_Subcategory`, etc.

### Comprehensive Format Columns
- **Basic Info**: product_id, name, description_html, slug, external_id
- **Pricing**: price_net, price_gross, price_olx, discount_percent, etc.
- **Categories**: category_path, category_slugs, weight_range, subcategory
- **Brand & Status**: brand_name, status, is_featured, featured_rank
- **Stock**: quantity, phone_order_only, location
- **Images**: image_url_1 through image_url_10
- **Dimensions**: dimension_a, dimension_b, dimension_c, dimension_d
- **Mount Systems**: mount_systems_codes, mount_systems_titles, mount_systems_prices
- **Drill Bits**: drill_bits_titles, drill_bits_prices
- **Technical Drawings**: technical_drawing_url, technical_drawings_codes, etc.
- **Specifications**: spec_width_cm, spec_pin_diameter_mm, spec_features, etc.
- **Similar Products**: similar_products_names, similar_products_slugs
- **Recommendation Settings**: recommendation_enabled, recommendation_keywords
- **Analytics**: views_count, date_updated, date_created

## Import to Baselinker

1. **Download** the appropriate CSV file
2. **Open** Baselinker panel
3. **Go to** Products → Import
4. **Select** the CSV file
5. **Map** columns to Baselinker fields
6. **Import** products

## Notes

- All prices are in PLN (Polish Złoty)
- VAT rate is 23% for all products
- Images are hosted on Sanity CDN
- Technical drawings and specifications are included where available
- Products are filtered to exclude hidden items
- Timestamps are in ISO format

## Support

For questions about the export format or import process, contact the development team.


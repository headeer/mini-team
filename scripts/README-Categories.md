# Grabie Categories Setup Guide

## 📁 New Grabie Categories Structure

The following categories have been created for the Grabie products:

### Main Category
- **Grabie** - General category for all rakes

### Specific Variants
1. **Grabie 100cm grubość zęba 12mm** - 100cm width, 12mm tooth thickness
2. **Grabie 100cm grubość zęba 15mm** - 100cm width, 15mm tooth thickness  
3. **Grabie 120cm grubość zęba 12mm** - 120cm width, 12mm tooth thickness
4. **Grabie 120cm grubość zęba 15mm** - 120cm width, 15mm tooth thickness

## 🚀 Importing Categories to Sanity

### Method 1: Using the TypeScript Script
```bash
# Set up environment variables first
export SANITY_API_WRITE_TOKEN="your_write_token_here"

# Run the import script
npx tsx scripts/import-grabie-categories.ts
```

### Method 2: Manual Import via Sanity CLI
```bash
# Import the NDJSON file
sanity dataset import scripts/create-grabie-categories.ndjson production
```

### Method 3: Manual Creation in Sanity Studio
1. Go to your Sanity Studio (usually `/studio`)
2. Navigate to **Categories** 
3. Create each category manually with the following data:

#### Grabie 100cm grubość zęba 12mm
- **Title**: `Grabie 100cm grubość zęba 12mm`
- **Slug**: `grabie-100cm-grubosc-zeba-12mm`
- **Description**: `Grabie 100cm z zębami grubość 12mm - kompaktowe rozwiązanie`
- **Featured**: `true`
- **Range**: `1500`

#### Grabie 100cm grubość zęba 15mm
- **Title**: `Grabie 100cm grubość zęba 15mm`
- **Slug**: `grabie-100cm-grubosc-zeba-15mm`
- **Description**: `Grabie 100cm z zębami grubość 15mm - wzmocniona wersja`
- **Featured**: `true`
- **Range**: `1580`

#### Grabie 120cm grubość zęba 12mm
- **Title**: `Grabie 120cm grubość zęba 12mm`
- **Slug**: `grabie-120cm-grubosc-zeba-12mm`
- **Description**: `Grabie 120cm z zębami grubość 12mm - standardowe rozwiązanie`
- **Featured**: `true`
- **Range**: `1650`

#### Grabie 120cm grubość zęba 15mm
- **Title**: `Grabie 120cm grubość zęba 15mm`
- **Slug**: `grabie-120cm-grubosc-zeba-15mm`
- **Description**: `Grabie 120cm z zębami grubość 15mm - najpopularniejszy model`
- **Featured**: `true`
- **Range**: `1750`

## 🖼️ Category Images
The system now uses real product images instead of generic icons:
- **100cm Grabie**: `/images/grabie/grabie_100cm_grubosc_zeba-removebg-preview.png`
- **120cm Grabie**: `/images/grabie/grabie_120cm-removebg-preview.png`

## ✅ UI Improvements Made

### Category Name Display
- **Fixed truncation**: Changed from `line-clamp-1` to `line-clamp-2` 
- **Better spacing**: Added proper line height and margins
- **Responsive layout**: Categories now show full names on hover/larger screens

### Image Enhancements  
- **Larger icons**: Increased from 40px to 64px for Grabie categories
- **Better image handling**: Uses `object-contain` for background-removed images
- **Smart detection**: Automatically detects Grabie categories for special rendering

### Pages Updated
- ✅ **HomeCategories.tsx** - Main category grid 
- ✅ **ProductCard.tsx** - Category labels on product cards
- ✅ **WishListProducts.tsx** - Category display in wishlist
- ✅ **CategoryList.tsx** - Already properly configured

## 🔧 Technical Details

### Product References
All Grabie products now use specific category references:
- `category-grabie-100cm-12mm`
- `category-grabie-100cm-15mm` 
- `category-grabie-120cm-12mm`
- `category-grabie-120cm-15mm`

### Category Mapping
Updated in `scripts/generate-categories-from-products.ts` with proper title mappings for all variants.

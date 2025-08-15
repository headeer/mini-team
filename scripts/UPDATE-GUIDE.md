# 📋 Complete Update Guide: Products & Categories

## 🗂️ **UPDATING CATEGORIES**

### **Method 1: Via Sanity Studio (Recommended)**
1. **Access Sanity Studio**: Go to `yoursite.com/studio` or run `npm run dev` and visit `localhost:3000/studio`
2. **Navigate to Categories**: Click on "Categories" in the sidebar
3. **Create/Edit Categories**: Use the data below

### **Method 2: Via Scripts**
```bash
# Import all Grabie categories at once
npx tsx scripts/import-grabie-categories.ts

# Or use NDJSON import
sanity dataset import scripts/create-grabie-categories.ndjson production
```

### **🏷️ IMPROVED CATEGORY TITLES** 
*(Fixed formatting to prevent awkward line breaks)*

#### **Łyżki Categories**
- **Old**: `Łyżki kopiące 1-2t` 
- **New**: `Łyżki kopiące 1-2t` *(add space between number and unit)*

#### **Grabie Categories**
- `Grabie` *(main category)*
- `Grabie 100cm • 12mm zęby`
- `Grabie 100cm • 15mm zęby` 
- `Grabie 120cm • 12mm zęby`
- `Grabie 120cm • 15mm zęby`

---

## 🛍️ **UPDATING PRODUCTS**

### **Method 1: Via Sanity Studio**
1. **Access Products**: Go to "Products" in Sanity Studio
2. **Edit Product**: Click on any product to edit
3. **Update Categories**: Change the category reference
4. **Update Images**: Upload new images or change URLs

### **Method 2: Via products.json**
Edit `/data/products.json` directly:

```json
{
  "name": "Grabie 100cm grubość zęba 12mm",
  "slug": "grabie-100cm-12mm",
  "images": [
    {
      "url": "/images/grabie/grabie_100cm_grubosc_zeba-removebg-preview.png"
    }
  ],
  "categories": [
    {
      "_ref": "category-grabie-100cm-12mm"
    }
  ]
}
```

### **Method 3: Bulk Update Script**
```bash
# Run the product import script  
npx tsx scripts/import-products-from-json.ts
```

---

## 🔧 **CATEGORY REFERENCE IDs**

### **Current Category References:**
| Category Name | Reference ID | Usage |
|---------------|--------------|--------|
| Grabie (Main) | `category-grabie` | General rake category |
| Grabie 100cm 12mm | `category-grabie-100cm-12mm` | Specific variant |
| Grabie 100cm 15mm | `category-grabie-100cm-15mm` | Specific variant |
| Grabie 120cm 12mm | `category-grabie-120cm-12mm` | Specific variant |
| Grabie 120cm 15mm | `category-grabie-120cm-15mm` | Specific variant |
| Łyżki kopiące 1-2t | `category-1-2t-kopiace` | Digging buckets |
| Łyżki skarpowe 1-2t | `category-1-2t-skarpowe` | Ditching buckets |
| Zrywaki korzeni | `category-zrywarki` | Root rippers |

---

## 🖼️ **IMAGE MANAGEMENT**

### **Current Image Structure:**
```
images/
├── grabie/
│   ├── grabie_100cm_grubosc_zeba-removebg-preview.png ✅ (Used)
│   ├── grabie_120cm-removebg-preview.png ✅ (Used)
│   ├── grabie_100cm_grubosc_zeba.png (Original)
│   └── grabie_120cm.png (Original)
├── lyzki_kopiace/
│   ├── lyzka-kopiaca-30cm-01.webp
│   └── lyzka-skarpowa-80cm-01.webp
└── products/
    └── [product images...]
```

### **Adding New Images:**
1. **Upload to correct folder**: `/images/[category]/`
2. **Use background-removed versions** for categories: `-removebg-preview.png`
3. **Update image references** in products.json or Sanity

---

## ⚡ **QUICK FIXES FOR COMMON ISSUES**

### **🔤 Fix Category Text Breaking**
The UI now automatically:
- Adds spaces between numbers and letters (`1-2t` → `1-2 t`)
- Prevents awkward line breaks
- Uses better word wrapping

### **📱 Mobile Display Issues**
```css
/* Applied automatically */
word-break: keep-all;
overflow-wrap: break-word;
hyphens: manual;
```

### **🖼️ Image Size Issues**
- **Category icons**: 64px for Grabie, 56px for others
- **Product images**: Use `object-contain` for background-removed images
- **Fallback**: Custom icons for categories without images

---

## 🚀 **STEP-BY-STEP UPDATE PROCESS**

### **Step 1: Update Categories in Sanity**
```bash
# Option A: Use script
npx tsx scripts/import-grabie-categories.ts

# Option B: Manual via Studio
# Go to studio → Categories → Create/Edit each category
```

### **Step 2: Verify Product References**
Check that products use correct category references:
```json
"categories": [
  {
    "_ref": "category-grabie-120cm-15mm"  // ✅ Specific reference
  }
]
```

### **Step 3: Test Display**
1. **Home page**: Check category grid displays correctly
2. **Shop page**: Verify category filters work
3. **Product cards**: Ensure category labels show properly
4. **Mobile**: Test on smaller screens

### **Step 4: Update Images (if needed)**
1. Replace old images with background-removed versions
2. Update image URLs in products.json
3. Clear any image caches

---

## 🎯 **CATEGORY DISPLAY IMPROVEMENTS MADE**

### **Before:**
- ❌ "Łyżki kopiące 1-" → next line "2t"
- ❌ Generic excavator icons everywhere
- ❌ Names truncated to 1 line
- ❌ Small 40px images

### **After:**
- ✅ "Łyżki kopiące 1-2t" (proper spacing)
- ✅ Real product images for categories
- ✅ 2-line category names with smart wrapping
- ✅ Larger 64px images for better visibility

---

## 🔍 **TROUBLESHOOTING**

### **Categories not showing?**
1. Check Sanity Studio for category existence
2. Verify category reference IDs match
3. Ensure products are published in Sanity

### **Images not loading?**
1. Check file paths in `/images/` folder
2. Verify image URLs in products.json
3. Clear browser cache

### **Text still breaking weird?**
1. The regex automatically adds spaces: `(\d+)([a-zA-Z])` → `$1 $2`
2. CSS prevents bad breaks with `word-break: keep-all`
3. Manual line breaks can be added with `<br/>` in category titles

### **Need to add more categories?**
1. **Add to `scripts/generate-categories-from-products.ts`** in TITLE_MAP
2. **Create in Sanity Studio** or use import script
3. **Update product references** to use new category ID

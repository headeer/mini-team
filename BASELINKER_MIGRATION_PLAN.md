# 🚀 Baselinker Migration Plan - Making Baselinker the Source of Truth

## 📊 Current Status Analysis

### ✅ What's Already Set Up
- **Baselinker API**: Connected and working
- **Inventory ID**: 72852
- **Categories**: 12 categories properly organized
  - Grabie (100cm, 120cm with different tooth sizes)
  - Wiertnice
  - Rippery/Zrywaki korzeni
  - Łyżki (1-1.5t, 1.5-2.3t, 2.3-3t, 3-5t)
- **Price Groups**: 1 group (Domyślna in PLN)
- **Products**: 0 (empty inventory - perfect for migration!)

### 🔧 What We've Built
- ✅ **Inventory Checker**: `npm run check:baselinker`
- ✅ **Sync System**: `npm run sync:baselinker`
- ✅ **API Endpoints**: `/api/baselinker-sync`
- ✅ **Webhook Support**: Real-time sync capability
- ✅ **Comprehensive Documentation**: `BASELINKER_SYNC_GUIDE.md`

## 🎯 Migration Strategy

### Phase 1: Data Export from Sanity (Current State)
```bash
# Export all products from Sanity to Baselinker format
npm run sync:baselinker sync:sanity-to-bl --dry-run

# Review what will be synced
npm run sync:baselinker sync:sanity-to-bl
```

### Phase 2: Baselinker as Source of Truth
```bash
# Sync from Baselinker to Sanity (making BL the source)
npm run sync:baselinker sync:bl-to-sanity --dry-run

# Actual sync
npm run sync:baselinker sync:bl-to-sanity
```

### Phase 3: Real-time Sync Setup
1. Configure Baselinker webhooks
2. Test webhook integration
3. Set up monitoring

## 📋 Step-by-Step Migration

### Step 1: Export Current Sanity Products to Baselinker

```bash
# 1. Check what we have in Sanity
curl "http://localhost:3000/api/baselinker-sync?action=status"

# 2. Export all products to Baselinker
npm run sync:baselinker sync:sanity-to-bl

# 3. Verify products are in Baselinker
npm run check:baselinker
```

### Step 2: Set Up Baselinker as Master

```bash
# 1. Clear Sanity products (optional - for clean migration)
# 2. Sync from Baselinker to Sanity
npm run sync:baselinker sync:bl-to-sanity

# 3. Verify sync worked
curl "http://localhost:3000/api/baselinker-sync?action=status"
```

### Step 3: Configure Webhooks

1. **Baselinker Panel Setup**:
   - Go to Settings → Integrations → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/baselinker-sync`
   - Select events: `product_created`, `product_updated`, `product_deleted`

2. **Test Webhook**:
   ```bash
   # Test webhook endpoint
   curl -X POST "http://localhost:3000/api/baselinker-sync" \
     -H "Content-Type: application/json" \
     -d '{
       "action": "webhook",
       "event": "product_updated",
       "data": {"product_id": "test123"}
     }'
   ```

## 🔄 Data Flow Architecture

### Current Flow (Sanity → Frontend)
```
Sanity CMS → Next.js API → Frontend
```

### New Flow (Baselinker → Sanity → Frontend)
```
Baselinker → Webhook → Sanity → Next.js API → Frontend
```

### Future Flow (Baselinker → Frontend)
```
Baselinker → Next.js API → Frontend
(Sanity as backup/cache only)
```

## 📊 Data Mapping

### Product Fields Mapping
| Sanity Field | Baselinker Field | Type | Notes |
|--------------|------------------|------|-------|
| `name` | `name` | string | Product name |
| `slug.current` | `sku` | string | Product SKU |
| `description` | `description` | text | Product description |
| `priceGross` | `price_brutto` | number | Gross price |
| `priceNet` | `price_netto` | number | Net price |
| `stock` | `quantity` | number | Stock quantity |
| `images[]` | `images[]` | array | Product images |
| `weightRange` | `features[WeightRange]` | string | Weight range |
| `subcategory` | `features[Subcategory]` | string | Subcategory |
| `toothCost` | `features[ToothCost]` | number | Tooth cost |
| `toothQty` | `features[ToothQty]` | number | Tooth quantity |
| `teethEnabled` | `features[TeethEnabled]` | boolean | Teeth enabled |
| `mountSystems[]` | `features[MountSystems]` | string | Mount systems |
| `dimensions` | `features[A,B,C,D]` | object | Dimensions |
| `externalId` | `product_id` | string | Baselinker ID |

### Category Mapping
| Sanity Category | Baselinker Category ID | Baselinker Name |
|-----------------|----------------------|-----------------|
| Łyżki kat. 1-1.5t | 5193715 | Łyżki kat. 1-1.5 Tony |
| Łyżki kat. 1.5-2.3t | 5193716 | Łyżki kat. 1.5-2.3 Tony |
| Łyżki kat. 2.3-3t | 5193717 | Łyżki kat. 2.3-3 Tony |
| Łyżki kat. 3-5t | 5193714 | Łyżki kat. 3-5 Tony |
| Grabie | 5193708 | Grabie |
| Wiertnice | 5193712 | Wiertnice |
| Zrywaki | 5193713 | Rippery/Zrywaki korzeni |

## 🚨 Risk Mitigation

### Backup Strategy
1. **Sanity Backup**: Export all products before migration
2. **Baselinker Backup**: Export products after initial sync
3. **Database Backup**: Full Sanity database backup

### Rollback Plan
1. **Quick Rollback**: Disable webhooks, restore from Sanity
2. **Full Rollback**: Re-import from Sanity backup
3. **Partial Rollback**: Sync specific products back to Sanity

### Testing Strategy
1. **Dry Run**: Always test with `--dry-run` first
2. **Staging**: Test on staging environment
3. **Gradual Migration**: Migrate categories one by one
4. **Monitoring**: Set up alerts for sync failures

## 📈 Monitoring & Maintenance

### Key Metrics to Monitor
- **Sync Success Rate**: % of successful webhook calls
- **Data Consistency**: Compare product counts between systems
- **Performance**: API response times
- **Error Rate**: Failed syncs and webhook errors

### Maintenance Tasks
- **Daily**: Check sync status
- **Weekly**: Review error logs
- **Monthly**: Full data consistency check
- **Quarterly**: Review and update field mappings

## 🎯 Success Criteria

### Phase 1 Complete When:
- [ ] All Sanity products exported to Baselinker
- [ ] Product counts match between systems
- [ ] All product data correctly mapped
- [ ] No data loss during export

### Phase 2 Complete When:
- [ ] Baselinker is the primary data source
- [ ] Webhooks are configured and working
- [ ] Real-time sync is operational
- [ ] Frontend reads from updated data

### Phase 3 Complete When:
- [ ] Sanity is used only as cache/backup
- [ ] All product management happens in Baselinker
- [ ] Webhook monitoring is in place
- [ ] Documentation is updated

## 🚀 Next Steps

### Immediate Actions (Today)
1. **Run initial export**: `npm run sync:baselinker sync:sanity-to-bl --dry-run`
2. **Review the output** and verify data mapping
3. **Execute the export**: `npm run sync:baselinker sync:sanity-to-bl`

### This Week
1. **Set up webhooks** in Baselinker panel
2. **Test webhook integration** with sample products
3. **Configure monitoring** and alerts
4. **Update documentation** for team

### This Month
1. **Complete migration** to Baselinker as source of truth
2. **Update frontend** to handle new data flow
3. **Train team** on Baselinker product management
4. **Implement monitoring dashboard**

## 📞 Support & Resources

- **Documentation**: `BASELINKER_SYNC_GUIDE.md`
- **API Reference**: `/api/baselinker-sync` endpoints
- **Scripts**: `scripts/baselinker-sync-system.ts`
- **Analysis**: `exports/baselinker-analysis-*.json`

## 🔧 Commands Reference

```bash
# Check current status
npm run check:baselinker

# Export Sanity → Baselinker
npm run sync:baselinker sync:sanity-to-bl

# Import Baselinker → Sanity
npm run sync:baselinker sync:bl-to-sanity

# Dry run (no changes)
npm run sync:baselinker sync:sanity-to-bl --dry-run

# API status check
curl "http://localhost:3000/api/baselinker-sync?action=status"
```

---

**Ready to start?** Run `npm run sync:baselinker sync:sanity-to-bl --dry-run` to see what will be exported!






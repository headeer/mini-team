import dotenv from "dotenv";
import { createClient } from "next-sanity";

dotenv.config({ path: ".env.local" });

type TierKey = "1-1.5t" | "1.5-2.3t" | "2.3-3t" | "3-5t";

type DiggingItem = { widthCm: number; priceNet: number; toothCost: number; toothQty: number };
type SkarpowaItem = { widthCm: number; priceNet: number; hydraulic?: boolean };

type Matrix = Record<
  TierKey,
  {
    digging: DiggingItem[];
    skarpowa: SkarpowaItem[];
  }
>;

const MATRIX: Matrix = {
  "1-1.5t": {
    digging: [
      { widthCm: 18, priceNet: 680, toothCost: 120, toothQty: 2 },
      { widthCm: 20, priceNet: 700, toothCost: 120, toothQty: 2 },
      { widthCm: 23, priceNet: 710, toothCost: 120, toothQty: 2 },
      { widthCm: 25, priceNet: 730, toothCost: 120, toothQty: 2 },
      { widthCm: 27, priceNet: 740, toothCost: 120, toothQty: 3 },
      { widthCm: 30, priceNet: 760, toothCost: 160, toothQty: 3 },
      { widthCm: 40, priceNet: 910, toothCost: 160, toothQty: 3 },
      { widthCm: 45, priceNet: 830, toothCost: 200, toothQty: 4 },
      { widthCm: 50, priceNet: 850, toothCost: 200, toothQty: 4 },
      { widthCm: 60, priceNet: 900, toothCost: 240, toothQty: 5 },
      { widthCm: 70, priceNet: 940, toothCost: 240, toothQty: 5 },
    ],
    skarpowa: [
      { widthCm: 80, priceNet: 970 },
      { widthCm: 90, priceNet: 1000 },
      { widthCm: 100, priceNet: 1040 },
    ],
  },
  "1.5-2.3t": {
    digging: [
      { widthCm: 25, priceNet: 960, toothCost: 120, toothQty: 2 },
      { widthCm: 30, priceNet: 980, toothCost: 160, toothQty: 3 },
      { widthCm: 40, priceNet: 1080, toothCost: 160, toothQty: 3 },
      { widthCm: 45, priceNet: 1120, toothCost: 200, toothQty: 4 },
      { widthCm: 50, priceNet: 1160, toothCost: 200, toothQty: 4 },
      { widthCm: 60, priceNet: 1200, toothCost: 240, toothQty: 5 },
    ],
    skarpowa: [
      { widthCm: 120, priceNet: 1550 },
      { widthCm: 130, priceNet: 1680 },
      { widthCm: 120, priceNet: 3200, hydraulic: true },
    ],
  },
  "2.3-3t": {
    digging: [
      { widthCm: 25, priceNet: 1060, toothCost: 120, toothQty: 2 },
      { widthCm: 30, priceNet: 1080, toothCost: 160, toothQty: 3 },
      { widthCm: 40, priceNet: 1090, toothCost: 160, toothQty: 3 },
      { widthCm: 45, priceNet: 1220, toothCost: 200, toothQty: 4 },
      { widthCm: 50, priceNet: 1260, toothCost: 200, toothQty: 4 },
      { widthCm: 60, priceNet: 1300, toothCost: 240, toothQty: 5 },
      { widthCm: 80, priceNet: 1390, toothCost: 270, toothQty: 6 },
    ],
    skarpowa: [
      { widthCm: 120, priceNet: 1550 },
      { widthCm: 130, priceNet: 1680 },
      { widthCm: 120, priceNet: 3200, hydraulic: true },
    ],
  },
  "3-5t": {
    digging: [
      { widthCm: 25, priceNet: 1550, toothCost: 130, toothQty: 2 },
      { widthCm: 30, priceNet: 1590, toothCost: 165, toothQty: 3 },
      { widthCm: 35, priceNet: 1620, toothCost: 165, toothQty: 3 },
      { widthCm: 40, priceNet: 1670, toothCost: 165, toothQty: 3 },
      { widthCm: 45, priceNet: 1730, toothCost: 165, toothQty: 3 },
      { widthCm: 50, priceNet: 1790, toothCost: 200, toothQty: 4 },
      { widthCm: 60, priceNet: 1920, toothCost: 200, toothQty: 4 },
      { widthCm: 70, priceNet: 1980, toothCost: 235, toothQty: 4 },
      { widthCm: 80, priceNet: 2080, toothCost: 235, toothQty: 4 },
      { widthCm: 90, priceNet: 2270, toothCost: 270, toothQty: 5 },
      { widthCm: 100, priceNet: 2400, toothCost: 270, toothQty: 5 },
    ],
    skarpowa: [
      { widthCm: 120, priceNet: 2090 },
      { widthCm: 150, priceNet: 2200 },
    ],
  },
};

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-03-20";
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN || process.env.SANITY_TOKEN || process.env.SANITY_API_READ_TOKEN;
const CREATE_MISSING = String(process.env.CREATE_MISSING || 'false').toLowerCase() === 'true';

if (!token) {
  console.error("Missing SANITY write token (set SANITY_API_WRITE_TOKEN in .env.local)");
}

const client = createClient({ projectId, dataset, apiVersion, useCdn: false, token });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[\(\)–—]/g, "-")
    .replace(/\.+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$|_/g, "");
}

function tierSlug(tier: TierKey): string {
  return tier.replace(/\./g, "_");
}

function makeSlug(type: "kopiaca" | "skarpowa" | "skarpowa-hydr", widthCm: number, tier: TierKey): string {
  const base = type === "kopiaca" ? `lyzka-${type}-${widthCm}cm-${tier}` : `lyzka-${type}-${widthCm}cm-${tier}`;
  return slugify(base);
}

function makeName(type: "kopiaca" | "skarpowa" | "skarpowa-hydr", widthCm: number, tier?: TierKey): string {
  if (type === "kopiaca") return `Łyżka kopiąca ${widthCm}cm${tier ? ` (${tier.replace('1.5','1,5')})` : ''}`.replace('(1-1.5t)', '(1-2t)');
  if (type === "skarpowa-hydr") return `Łyżka skarpowa Hydr ${widthCm}cm`;
  return `Łyżka skarpowa ${widthCm}cm`;
}

function drawingsFor(type: "kopiaca" | "skarpowa" | "skarpowa-hydr", tier: TierKey) {
  const isLargeTier = tier === "2.3-3t" || tier === "3-5t";
  const code = type === "kopiaca"
    ? (isLargeTier ? "lyzka_kopiaca_v2" : "lyzka_kopiaca_v1")
    : (isLargeTier ? "lyzka_skarpowa_v2" : "lyzka_skarpowa_v1");
  return [ { title: undefined, code } ];
}

async function updateExistingProduct(params: {
  type: "kopiaca" | "skarpowa" | "skarpowa-hydr";
  widthCm: number;
  tier: TierKey;
  priceNet: number;
  toothCost?: number;
  toothQty?: number;
}) {
  const { type, widthCm, tier, priceNet, toothCost, toothQty } = params;
  const slug = makeSlug(type, widthCm, tier);
  const name = makeName(type, widthCm, tier);
  const subcategory = type === "kopiaca" ? "lyzki-kopiace" : "lyzki-skarpowe";
  const isPhoneOrderOnly = false;

  // Try find by slug OR exact name, prefer subcategory match when possible
  const existing = await client.fetch(
    `*[_type=='product' && (slug.current==$slug || name==$name) && (!defined(subcategory) || subcategory==$sub)]{ _id, name, specifications }[0]`,
    { slug, name, sub: subcategory }
  );
  let matched: any = existing;
  if (!matched?._id) {
    // Try fallback by name only
    const fallback = await client.fetch(`*[_type=='product' && name==$name]{ _id, name, specifications }[0]`, { name });
    if (!fallback?._id) {
      // Try by type + width pattern in name (ignoring tier parentheses)
      const typeToken = type === 'kopiaca' ? '*kopi*' : '*skarpo*';
      const widthToken = `*${widthCm}cm*`;
      const patternHit = await client.fetch(
        `*[_type=='product' && name match $w && name match $t]{ _id, name, specifications }[0]`,
        { w: widthToken, t: typeToken }
      );
      if (!patternHit?._id) {
        // Fallback: by specifications.widthCm and expected subcategory (or generic width match)
        const bySpec = await client.fetch(
          `*[_type=='product' && specifications.widthCm == $w && (!defined(subcategory) || subcategory==$sub)]{ _id, name, specifications }[0]`,
          { w: widthCm, sub: subcategory }
        );
        if (bySpec?._id) {
          matched = bySpec;
        } else {
          const genericName = await client.fetch(
            `*[_type=='product' && name match $w2 && name match 'Łyżka*']{ _id, name, specifications }[0]`,
            { w2: widthToken }
          );
          if (genericName?._id) {
            matched = genericName;
          } else {
            if (!CREATE_MISSING) {
              console.log(`⚠️  Skip (not found): ${name} [${tier}]`);
              return;
            }
            // Create missing with full fields
            const categorySlugByTier: Record<TierKey, string> = {
              "1-1.5t": "lyzki-1-1.5t",
              "1.5-2.3t": "lyzki-1.5-2.3t",
              "2.3-3t": "lyzki-2.3-3t",
              "3-5t": "lyzki-3-5t",
            };
            const catSlug = categorySlugByTier[tier];
            const weightCatId = await client.fetch(`*[_type=='category' && slug.current==$s][0]._id`, { s: catSlug });
            const brandId = await client.fetch(`*[_type=='brand' && (title match 'MiniTeamProject' || slug.current match 'mtt' || slug.current match 'miniteam*')][0]._id`);
            const vat = 0.23;
            const priceGross = Math.round(priceNet * (1 + vat) * 100) / 100;
            const doc: any = {
              _type: "product",
              _id: `product-${slug}`,
              name,
              slug: { _type: "slug", current: slug },
              description: `${type === 'kopiaca' ? 'Łyżka kopiąca' : 'Łyżka skarpowa'} ${widthCm}cm do maszyn ${tier.replace('1.5','1,5').replace('t',' t')}. Lemiesz tnący 110×16mm Hardox HB500. Opcjonalnie: zęby, spód Hardox HB500.`,
              priceNet,
              priceGross,
              priceTier: tier,
              subcategory,
              toothCost,
              toothQty,
              teethEnabled: type === 'kopiaca',
              stock: 0,
              brand: brandId ? { _type: 'reference', _ref: brandId } : { _type: 'reference', _ref: 'brand-MTT' },
              status: "hot",
              specifications: {
                widthCm,
                quickCoupler: type === 'kopiaca' ? 'Lehnhoff MS01, Verachtert CW05' : undefined,
                features: ["Lemiesz Hardox HB500", ...(type === 'kopiaca' ? ["Opcjonalne zęby"] : [])],
                machineCompatibility: [
                  "JCB","CAT","Yanmar","Volvo","Bobcat","Hitachi","Atlas","Hyundai","Case","John Deere","Mecalac","Kubota","Liebherr","Takeuchi"
                ],
                kinetyka: 90,
                ramie: 96,
              },
              dateUpdated: new Date().toISOString(),
              externalId: `${widthCm}cm-${tier.replace('1.5','1-5')}`,
              location: "Cieszków",
              viewsCount: 0,
              featuredRank: 0,
              isFeatured: false,
              technicalDrawings: drawingsFor(type, tier),
              categories: weightCatId ? [{ _type: 'reference', _ref: weightCatId }] : undefined,
            };
            await client.createIfNotExists(doc);
            console.log(`➕ Created: ${name} [${tier}]`);
            return;
          }
        }
      } else {
        matched = patternHit;
      }
    } else {
      matched = fallback;
    }
  }

  await client
    .patch(matched._id)
    .set({
      // Preserve existing name; only update fields below
      priceNet,
      priceTier: tier,
      subcategory,
      ...(typeof toothCost === "number" ? { toothCost } : {}),
      ...(typeof toothQty === "number" ? { toothQty } : {}),
      ...(type === "kopiaca" ? { teethEnabled: true } : {}),
      phoneOrderOnly: isPhoneOrderOnly,
      technicalDrawings: drawingsFor(type, tier),
      specifications: {
        ...((matched as any)?.specifications || {}),
        widthCm,
      },
    })
    .commit();
  console.log(`✅ Updated: ${name} [${tier}]`);
}

async function run() {
  // Digging buckets
  for (const tier of Object.keys(MATRIX) as TierKey[]) {
    const cfg = MATRIX[tier];
    for (const d of cfg.digging) {
      await updateExistingProduct({ type: "kopiaca", widthCm: d.widthCm, tier, priceNet: d.priceNet, toothCost: d.toothCost, toothQty: d.toothQty });
    }
    for (const s of cfg.skarpowa) {
      await updateExistingProduct({ type: s.hydraulic ? "skarpowa-hydr" : "skarpowa", widthCm: s.widthCm, tier, priceNet: s.priceNet });
    }
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});



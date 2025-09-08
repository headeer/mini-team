import fs from "fs";
import path from "path";

type TierKey = "1-1.5t" | "1.5-2.3t" | "2.3-3t" | "3-5t";
type DiggingItem = { widthCm: number; priceNet: number; toothCost: number; toothQty: number };
type SkarpowaItem = { widthCm: number; priceNet: number; hydraulic?: boolean };
type Matrix = Record<TierKey, { digging: DiggingItem[]; skarpowa: SkarpowaItem[] }>;

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

function productKey(type: "kopiaca" | "skarpowa" | "skarpowa-hydr", widthCm: number) {
  if (type === "kopiaca") return `Łyżka ${widthCm}cm`;
  if (type === "skarpowa-hydr") return `Łyżka skarpowa Hydr ${widthCm}cm`;
  return `Łyżka skarpowa ${widthCm}cm`;
}

function loadExport(): any[] {
  const file = path.join(process.cwd(), "exports/products.json");
  if (!fs.existsSync(file)) {
    throw new Error("exports/products.json not found. Run: npm run export:products");
  }
  const raw = fs.readFileSync(file, "utf8");
  return JSON.parse(raw);
}

function main() {
  const products = loadExport();
  const byName = new Map<string, any>();
  const byTypeWidth = new Map<string, any>();
  const norm = (s: string) => String(s || '').toLowerCase();
  const widthFrom = (n: string): number | undefined => {
    const m = n.match(/(\d{2,3})\s*cm/);
    return m ? Number(m[1]) : undefined;
  };
  const typeFrom = (n: string): 'kopiaca' | 'skarpowa' | undefined => {
    const ln = norm(n);
    if (ln.includes('skarpo')) return 'skarpowa';
    if (ln.includes('kopi')) return 'kopiaca';
    return undefined;
  };
  for (const p of products) {
    const name: string = String(p?.name || '').trim();
    if (!name) continue;
    byName.set(name, p);
    const width = widthFrom(name);
    const t = typeFrom(name);
    if (width && t) {
      byTypeWidth.set(`${t}:${width}`, p);
    }
  }
  const updates: Array<{ tier: TierKey; type: string; widthCm: number; name: string; current?: { priceNet?: number; toothCost?: number; toothQty?: number }; next: { priceNet?: number; toothCost?: number; toothQty?: number } }> = [];
  const missing: Array<{ tier: TierKey; type: string; widthCm: number; name: string }> = [];

  (Object.keys(MATRIX) as TierKey[]).forEach((tier) => {
    const cfg = MATRIX[tier];
    // Digging
    for (const d of cfg.digging) {
      const name = productKey("kopiaca", d.widthCm);
      const hit = byTypeWidth.get(`kopiaca:${d.widthCm}`) || byName.get(name);
      if (hit) {
        updates.push({ tier, type: "kopiaca", widthCm: d.widthCm, name, current: { priceNet: hit.priceNet ?? hit.pricing?.priceNet, toothCost: hit.toothCost, toothQty: hit.toothQty }, next: { priceNet: d.priceNet, toothCost: d.toothCost, toothQty: d.toothQty } });
      } else {
        missing.push({ tier, type: "kopiaca", widthCm: d.widthCm, name });
      }
    }
    // Skarpowa
    for (const s of cfg.skarpowa) {
      const type = s.hydraulic ? "skarpowa-hydr" : "skarpowa";
      const name = productKey(type as any, s.widthCm);
      const key = type === 'skarpowa-hydr' ? `skarpowa:${s.widthCm}` : `skarpowa:${s.widthCm}`;
      const hit = byTypeWidth.get(key) || byName.get(name);
      if (hit) {
        updates.push({ tier, type, widthCm: s.widthCm, name, current: { priceNet: hit.priceNet ?? hit.pricing?.priceNet }, next: { priceNet: s.priceNet } });
      } else {
        missing.push({ tier, type, widthCm: s.widthCm, name });
      }
    }
  });

  // Output summary
  console.log("\nPlanned updates (existing only, no creation):\n");
  for (const u of updates) {
    const curr = u.current || {} as any;
    console.log(`- [${u.tier}] ${u.type} ${u.widthCm}cm → ${u.name} | priceNet: ${curr.priceNet ?? "?"} → ${u.next.priceNet}${u.type === 'kopiaca' ? `; teeth: ${curr.toothQty ?? 0}× @ ${curr.toothCost ?? 0} → ${u.next.toothQty ?? 0}× @ ${u.next.toothCost ?? 0}` : ''}`);
  }
  console.log(`\nTotal updates: ${updates.length}`);

  console.log("\nMissing variants (will be skipped in update-only mode):\n");
  for (const m of missing) {
    console.log(`- [${m.tier}] ${m.type} ${m.widthCm}cm → ${m.name}`);
  }
  console.log(`\nTotal missing: ${missing.length}`);
}

main();



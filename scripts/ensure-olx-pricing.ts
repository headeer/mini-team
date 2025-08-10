// scripts/ensure-olx-pricing.ts
import fs from "fs";
import path from "path";

type Product = {
  name: string;
  slug: string;
  price?: number | string;
  priceOlx?: number | string;
  basePrice?: number;
  [key: string]: any;
};

const ROOT = process.cwd();
const INPUT = path.join(ROOT, "data/products.json");

function isNumeric(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function main() {
  if (!fs.existsSync(INPUT)) {
    throw new Error(`Missing file: ${INPUT}`);
  }
  const raw = fs.readFileSync(INPUT, "utf8");
  const arr = JSON.parse(raw) as Product[];
  if (!Array.isArray(arr)) throw new Error("products.json must be an array");

  let changed = 0;
  const updated = arr.map((p) => {
    const site = isNumeric(p.price) ? p.price : isNumeric(p.basePrice) ? p.basePrice! : undefined;
    const olxNum = isNumeric(p.priceOlx) ? p.priceOlx : undefined;
    const olxStr = typeof p.priceOlx === "string" ? p.priceOlx : undefined;

    // Keep phone-order unchanged
    if (olxStr && /zamówienia telefoniczne/i.test(olxStr)) {
      return p;
    }

    if (typeof site === "number") {
      const target = Math.ceil(site * 1.08); // +8%
      if (typeof olxNum === "number") {
        if (olxNum <= site) {
          p.priceOlx = target;
          changed++;
        }
      } else if (typeof p.priceOlx === "undefined") {
        p.priceOlx = target;
        changed++;
      }
    }
    return p;
  });

  fs.writeFileSync(INPUT, JSON.stringify(updated, null, 2));
  // eslint-disable-next-line no-console
  console.log(`Updated products.json. Adjusted OLX pricing on ${changed} products.`);
}

main();


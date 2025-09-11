import Stripe from "stripe";
// Note: Next.js already loads .env/.env.local. Avoid re-importing dotenv here to prevent conflicts.

let stripeSingleton: Stripe | null | undefined = undefined;

function readStripeKey(): string | null {
  const raw =
    process.env.STRIPE_SECRET_KEY ||
    process.env.STRIPE_API_KEY ||
    process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY ||
    "";
  const sanitized = raw.replace(/^['"]|['"]$/g, "").trim();
  if (!sanitized || !sanitized.startsWith("sk_")) return null;
  return sanitized;
}

export function getStripe(): Stripe | null {
  if (stripeSingleton !== undefined) return stripeSingleton as Stripe | null;
  try {
    const key = readStripeKey();
    if (!key) {
      stripeSingleton = null;
      // eslint-disable-next-line no-console
      console.warn("[Stripe] Secret key missing or invalid. Ensure STRIPE_SECRET_KEY=sk_test_... is set.");
      return stripeSingleton;
    }
    stripeSingleton = new Stripe(key, { apiVersion: "2025-03-31.basil" });
    return stripeSingleton;
  } catch (e) {
    stripeSingleton = null;
    // eslint-disable-next-line no-console
    console.error("[Stripe] Failed to initialize Stripe:", e);
    return stripeSingleton;
  }
}

export default getStripe;

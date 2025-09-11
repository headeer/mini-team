"use server";

import { headers } from "next/headers";
import getStripe from "@/lib/stripe";
import { urlFor } from "@/sanity/lib/image";

type CartProduct = {
  _id?: string;
  name?: string;
  description?: string;
  price?: number;
  basePrice?: number;
  images?: Array<{ asset?: { _ref?: string } } | string>;
};

export interface GroupedCartItems {
  product: CartProduct;
  quantity: number;
}

export async function fetchStripeClientSecret(items: GroupedCartItems[]) {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe is not configured");

  const origin = (await headers()).get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const lineItems = items.map((item) => ({
    price_data: {
      currency: "PLN",
      unit_amount: Math.round((
        typeof (item?.product as any)?.basePrice === "number"
          ? (item?.product as any).basePrice
          : typeof item?.product?.price === "number"
          ? (item?.product?.price as number)
          : 0
      ) * 100),
      product_data: {
        name: item?.product?.name || "Produkt",
        description: item?.product?.description,
        images: (() => {
          const toSrc = (img: any): string | null => {
            if (!img) return null;
            if (typeof img === "string") return img || null;
            if (typeof img === "object" && img.url) return img.url || null;
            if (typeof img === "object" && img.asset?._ref) {
              try { return urlFor(img).url(); } catch { return null; }
            }
            return null;
          };
          const direct = (item?.product as any)?.cover || (item?.product as any)?.imageUrls?.[0]?.url;
          const fallback = item?.product?.images && item?.product?.images?.length > 0 ? toSrc(item?.product?.images[0]) : null;
          const resolved = direct || fallback;
          return resolved ? [resolved] : undefined;
        })(),
        metadata: { id: item?.product?._id || "" },
      },
    },
    quantity: item?.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    mode: "payment",
    allow_promotion_codes: true,
    invoice_creation: { enabled: true },
    line_items: [
      ...lineItems,
      // Flat pallet shipping (net 160 PLN)
      {
        price_data: {
          currency: "PLN",
          unit_amount: 16000,
          product_data: { name: "Wysyłka paletowa (netto)" },
        },
        quantity: 1,
      },
    ],
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  return session.client_secret;
}



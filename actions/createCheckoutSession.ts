"use server";

import getStripe from "@/lib/stripe";
import { Address } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { CartItem } from "@/store";
import Stripe from "stripe";
import { headers } from "next/headers";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string;
  address?: Address | null;
  promoCode?: string;
  freeShipping?: boolean;
}

export interface GroupedCartItems {
  product: CartItem["product"];
  quantity: number;
  configuration?: CartItem["configuration"]; // include selected extras
}

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata
) {
  try {
    // Determine base URL from env or current request (prevents redirecting to preview domains)
    const hdrs = await headers();
    const host = hdrs.get('x-forwarded-host') || hdrs.get('host');
    const proto = hdrs.get('x-forwarded-proto') || (host && host.includes('localhost') ? 'http' : 'https');
    const runtimeBase = host ? `${proto}://${host}` : undefined;
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      runtimeBase ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    // Retrieve existing customer or create a new one
    const stripe = getStripe();
    if (!stripe) {
      console.error("Stripe not configured – missing STRIPE_SECRET_KEY env. Returning fallback URL.");
      return process.env.NEXT_PUBLIC_CANCEL_URL || `${baseUrl}/checkout`;
    }
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });
    const customerId = customers?.data?.length > 0 ? customers.data[0].id : "";

    const computeUnitNet = (product: any, configuration?: GroupedCartItems["configuration"]): number => {
      const baseCandidate = product?.pricing?.priceNet ?? product?.priceNet ?? product?.basePrice ?? product?.price ?? 0;
      const baseNet = typeof baseCandidate === "string" ? parseFloat(baseCandidate) : (Number(baseCandidate) || 0);
      const mount = configuration?.mount?.price ?? 0;
      const drill = configuration?.drill?.price ?? 0;
      const teeth = configuration?.teeth?.enabled ? (configuration?.teeth?.price ?? 0) : 0;
      return baseNet + (Number(mount) || 0) + (Number(drill) || 0) + (Number(teeth) || 0);
    };

    const computeUnitGross = (product: any, configuration?: GroupedCartItems["configuration"]): number => {
      const netPrice = computeUnitNet(product, configuration);
      return netPrice * 1.23; // Add 23% VAT to get gross price
    };

    const formatName = (item: GroupedCartItems): string => {
      const p: any = item.product || {};
      const base = p?.title || p?.name || "Produkt";
      const width = p?.specifications?.widthCm ? `${p.specifications.widthCm}cm` : "";
      const tier = p?.priceTier ? `(${p.priceTier})` : "";
      const mount = item.configuration?.mount?.title ? `, ${item.configuration.mount.title}` : (p?.specifications?.quickCoupler ? `, ${p.specifications.quickCoupler}` : "");
      const teeth = item.configuration?.teeth?.enabled ? ", zęby" : "";
      const parts = [base, width, tier].filter(Boolean).join(" ");
      return `${parts}${mount}${teeth}`.trim();
    };

    const formatDescription = (item: GroupedCartItems): string | undefined => {
      const p: any = item.product || {};
      const desc: string | undefined = p?.description;
      const extras: string[] = [];
      if (item.configuration?.mount?.title) extras.push(`Mocowanie: ${item.configuration.mount.title}`);
      if (item.configuration?.drill?.title) extras.push(`Wiertło: ${item.configuration.drill.title}`);
      if (item.configuration?.teeth?.enabled) extras.push(`Zęby: tak`);
      const suffix = extras.length ? `\n${extras.join(" | ")}` : "";
      const trimmed = typeof desc === 'string' ? desc.slice(0, 280) : undefined;
      return (trimmed ? trimmed : undefined)?.concat(suffix) || (extras.length ? extras.join(" | ") : undefined);
    };

    const freeShip = Boolean(metadata.freeShipping);

    // Prepare optional Stripe promotion code for free shipping (works in Stripe UI)
    let promoCodeId: string | undefined;
    if (metadata.promoCode && typeof metadata.promoCode === 'string') {
      try {
        const existing = await (getStripe() as Stripe).promotionCodes.list({ code: metadata.promoCode, limit: 1 });
        if (existing?.data?.length) {
          promoCodeId = existing.data[0].id;
        } else {
          const coupon = await (getStripe() as Stripe).coupons.create({ free_shipping: { }, duration: 'once' });
          const created = await (getStripe() as Stripe).promotionCodes.create({ coupon: coupon.id, code: metadata.promoCode, active: true });
          promoCodeId = created.id;
        }
      } catch {
        // Ignore promo code provisioning failures; checkout will still proceed
      }
    }

    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      metadata: {
        orderNumber: metadata.orderNumber,
        customerName: metadata.customerName,
        customerEmail: metadata.customerEmail,
        clerkUserId: metadata.clerkUserId!,
        address: JSON.stringify(metadata.address),
        promoCode: metadata.promoCode || '',
        freeShipping: String(freeShip),
      },
      locale: 'pl',
      mode: "payment",
      allow_promotion_codes: true,
      payment_method_types: ["card"],
      invoice_creation: {
        enabled: true,
      },
      success_url: `${
        process.env.NEXT_PUBLIC_SUCCESS_URL || `${baseUrl}/success`
      }?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_CANCEL_URL || `${baseUrl}/cart`}`,
      line_items: [
        ...items?.map((item) => ({
          price_data: {
            currency: "pln",
            unit_amount: Math.round(computeUnitGross(item.product, item.configuration) * 100),
            product_data: {
              name: formatName(item),
              description: formatDescription(item),
              metadata: { id: (item?.product as any)?._id },
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
                const fallback = (item?.product as any)?.images && (item?.product as any)?.images?.length > 0 ? toSrc((item?.product as any)?.images[0]) : null;
                const resolved = direct || fallback;
                return resolved ? [resolved] : undefined;
              })(),
            },
          },
          quantity: item?.quantity,
        })),
      ],
      // Use Stripe shipping rates instead of a line item so promo codes can zero shipping
      shipping_address_collection: { allowed_countries: ['PL'] },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: 'Wysyłka paletowa',
            type: 'fixed_amount',
            fixed_amount: { amount: 19680, currency: 'pln' },
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 3 },
            },
          },
        },
      ],
    };

    // Pre-apply promotion code if we flagged free shipping
    if (freeShip && promoCodeId) {
      (sessionPayload as any).discounts = [{ promotion_code: promoCodeId }];
    }
    if (customerId) {
      sessionPayload.customer = customerId;
    } else {
      sessionPayload.customer_email = metadata.customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionPayload);
    return session.url;
  } catch (error) {
    console.error("Error creating Checkout Session", error);
    throw error;
  }
}

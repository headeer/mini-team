"use server";

import stripe from "@/lib/stripe";
import { Address } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { CartItem } from "@/store";
import Stripe from "stripe";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string;
  address?: Address | null;
}

export interface GroupedCartItems {
  product: CartItem["product"];
  quantity: number;
}

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata
) {
  try {
    // Retrieve existing customer or create a new one
    if (!stripe) throw new Error("Stripe not configured");
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });
    const customerId = customers?.data?.length > 0 ? customers.data[0].id : "";

    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      metadata: {
        orderNumber: metadata.orderNumber,
        customerName: metadata.customerName,
        customerEmail: metadata.customerEmail,
        clerkUserId: metadata.clerkUserId!,
        address: JSON.stringify(metadata.address),
      },
      mode: "payment",
      allow_promotion_codes: true,
      payment_method_types: ["card"],
      invoice_creation: {
        enabled: true,
      },
      success_url: `${
        process.env.NEXT_PUBLIC_SUCCESS_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/success`
      }?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_CANCEL_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/cart`}`,
      line_items: items?.map((item) => ({
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
            name: item?.product?.name || "Unknown Product",
            description: item?.product?.description,
            metadata: { id: item?.product?._id },
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
          },
        },
        quantity: item?.quantity,
      })),
    };
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

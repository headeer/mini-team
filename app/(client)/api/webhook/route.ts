import { Metadata } from "@/actions/createCheckoutSession";
import getStripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "No Signature found for stripe" },
      { status: 400 }
    );
  }
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.log("Stripe webhook secret is not set");
    return NextResponse.json(
      {
        error: "Stripe webhook secret is not set",
      },
      { status: 400 }
    );
  }
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      {
        error: `Webhook Error: ${error}`,
      },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const invoice = session.invoice
      ? await stripe.invoices.retrieve(session.invoice as string)
      : null;

    try {
      await createOrderInSanity(stripe, session, invoice);
      await sendOrderEmails(stripe, session, invoice).catch(() => {});
    } catch (error) {
      console.error("Error creating order in sanity:", error);
      return NextResponse.json(
        {
          error: `Error creating order: ${error}`,
        },
        { status: 400 }
      );
    }
  }
  return NextResponse.json({ received: true });
}

async function createOrderInSanity(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
  invoice: Stripe.Invoice | null
) {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    total_details,
  } = session;
  const { orderNumber, customerName, customerEmail, clerkUserId: clerkMeta, address } =
    metadata as unknown as Metadata & { address: string };
  const safeClerkUserId = clerkMeta || 'guest';
  const parsedAddress = address ? JSON.parse(address) : null;

  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
    id,
    { expand: ["data.price.product"] }
  );

  // Create Sanity product references and prepare stock updates
  const sanityProducts = [];
  const stockUpdates = [];
  for (const item of lineItemsWithProduct.data) {
    const productId = (item.price?.product as Stripe.Product)?.metadata?.id;
    const quantity = item?.quantity || 0;

    if (!productId) continue;

    sanityProducts.push({
      _key: crypto.randomUUID(),
      product: {
        _type: "reference",
        _ref: productId,
      },
      quantity,
    });
    stockUpdates.push({ productId, quantity });
  }
  //   Create order in Sanity

  const order = await backendClient.create({
    _type: "order",
    orderNumber,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    customerName,
    stripeCustomerId: customerEmail,
    clerkUserId: safeClerkUserId,
    email: customerEmail,
    currency,
    amountDiscount: total_details?.amount_discount
      ? total_details.amount_discount / 100
      : 0,

    products: sanityProducts,
    totalPrice: amount_total ? amount_total / 100 : 0,
    status: "paid",
    orderDate: new Date().toISOString(),
    invoice: invoice
      ? {
          id: invoice.id,
          number: invoice.number,
          hosted_invoice_url: invoice.hosted_invoice_url,
        }
      : null,
    address: parsedAddress
      ? {
          state: parsedAddress.state,
          zip: parsedAddress.zip,
          city: parsedAddress.city,
          address: parsedAddress.address,
          name: parsedAddress.name,
        }
      : null,
  });

  // Update stock levels in Sanity

  await updateStockLevels(stockUpdates);
  return order;
}

// Function to update stock levels
async function updateStockLevels(
  stockUpdates: { productId: string; quantity: number }[]
) {
  for (const { productId, quantity } of stockUpdates) {
    try {
      // Fetch current stock
      const product = await backendClient.getDocument(productId);

      if (!product || typeof product.stock !== "number") {
        console.warn(
          `Product with ID ${productId} not found or stock is invalid.`
        );
        continue;
      }

      const newStock = Math.max(product.stock - quantity, 0); // Ensure stock does not go negative

      // Update stock in Sanity
      await backendClient.patch(productId).set({ stock: newStock }).commit();
    } catch (error) {
      console.error(`Failed to update stock for product ${productId}:`, error);
    }
  }
}

// Email sending via Resend API (no extra deps)
async function sendOrderEmails(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
  invoice: Stripe.Invoice | null
) {
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM = process.env.ORDER_EMAIL_FROM || process.env.RESEND_FROM;
    const ADMIN = process.env.ORDER_EMAIL_BCC || process.env.ORDER_EMAIL_ADMIN;
    if (!RESEND_API_KEY || !FROM) {
      console.warn("[Email] Missing RESEND_API_KEY or ORDER_EMAIL_FROM. Skipping emails.");
      return;
    }

    // Collect line items for email
    const items = await stripe.checkout.sessions.listLineItems(session.id, { expand: ["data.price.product"] });
    const rows = items.data.map((li) => {
      const name = ((li.price?.product as any)?.name as string) || li.description || "Produkt";
      const qty = li.quantity || 1;
      const unit = (li.price?.unit_amount || 0) / 100;
      return `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee">${name}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center">${qty}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">${unit.toFixed(2)} ${String(li.price?.currency || 'pln').toUpperCase()}</td></tr>`;
    }).join("");

    const totalGross = (session.amount_total || 0) / 100;
    const currency = String(session.currency || "pln").toUpperCase();
    const orderNumber = (session.metadata as any)?.orderNumber || session.id;
    const email = session.customer_details?.email || session.customer_email || ADMIN; // fallback to admin

    const baseHtml = `
      <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111">
        <h2 style="margin:0 0 8px">Zamówienie potwierdzone</h2>
        <p style="margin:0 0 12px">Dziękujemy za zakup. Przetwarzamy Twoje zamówienie i wkrótce je wyślemy.</p>
        <p style="margin:0 0 12px"><strong>Numer zamówienia:</strong> ${orderNumber}</p>
        <table style="width:100%;border-collapse:collapse;border:1px solid #eee">
          <thead>
            <tr>
              <th style="text-align:left;padding:6px 8px;border-bottom:1px solid #eee">Produkt</th>
              <th style="text-align:center;padding:6px 8px;border-bottom:1px solid #eee">Ilość</th>
              <th style="text-align:right;padding:6px 8px;border-bottom:1px solid #eee">Cena (brutto)</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr>
              <td></td>
              <td style="text-align:right;padding:10px 8px"><strong>Razem:</strong></td>
              <td style="text-align:right;padding:10px 8px"><strong>${totalGross.toFixed(2)} ${currency}</strong></td>
            </tr>
          </tfoot>
        </table>
        ${invoice?.hosted_invoice_url ? `<p style="margin:12px 0">Faktura: <a href="${invoice.hosted_invoice_url}">${invoice.number || invoice.id}</a></p>`: ''}
        <p style="margin:12px 0">W razie pytań: <a href="mailto:teodorczykpt@gmail.com">teodorczykpt@gmail.com</a> • <a href="tel:+48782851962">782‑851‑962</a></p>
        <p style="margin:16px 0 0">Pozdrawiamy,<br/>Mini Team Project</p>
      </div>
    `;

    const send = async (to: string | null, subject: string, html: string) => {
      if (!to) return;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: FROM, to, subject, html, bcc: ADMIN || undefined }),
      });
    };

    await send(email || undefined as any, `Potwierdzenie zamówienia #${orderNumber}`, baseHtml);
    if (ADMIN) {
      await send(ADMIN, `Nowe zamówienie #${orderNumber}`, baseHtml);
    }
  } catch (e) {
    console.warn("[Email] Failed to send order emails:", e);
  }
}

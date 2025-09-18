"use client";

import Container from "@/components/Container";
import Title from "@/components/Title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PriceFormatter from "@/components/PriceFormatter";
import useStore from "@/store";
import { useEffect, useMemo, useCallback, useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { createCheckoutSession, Metadata, GroupedCartItems } from "@/actions/createCheckoutSession";
import { fetchStripeClientSecret } from "@/actions/fetchStripeClientSecret";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe.js once at module scope (avoids multiple instances)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");
import { useUser } from "@clerk/nextjs";

export default function CheckoutPage() {
  const groupedItems = useStore((s) => s.getGroupedItems());
  const { user } = useUser();
  const [payMethod, setPayMethod] = useState<"stripe" | "transfer">("stripe");
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  type CartProduct = {
    basePrice?: number;
    price?: number | string;
    pricing?: { priceNet?: number | string };
    toothCost?: number;
    toothQty?: number;
    title?: string;
    name?: string;
    _id?: string;
    images?: Array<{ asset?: { _ref?: string } } | string>;
  };
  const computeUnitFullPrice = useCallback((product: CartProduct) => {
    const candidate =
      (typeof product?.pricing?.priceNet === 'number' ? product.pricing.priceNet : (typeof product?.pricing?.priceNet === 'string' ? parseFloat(product.pricing.priceNet) : undefined)) ??
      (typeof product?.basePrice === 'number' ? product.basePrice : undefined) ??
      (typeof product?.price === 'string' ? parseFloat(product.price) : (typeof product?.price === 'number' ? product.price : 0));
    const base = Number.isFinite(candidate as number) ? (candidate as number) : 0;
    const toothCost = typeof product?.toothCost === "number" ? product.toothCost : 0;
    const toothQty = typeof product?.toothQty === "number" ? product.toothQty : 0;
    return base + toothCost * toothQty;
  }, []);

  const subtotalNet = useMemo(() => groupedItems.reduce((sum, it) => sum + computeUnitFullPrice(it.product) * it.quantity, 0), [groupedItems, computeUnitFullPrice]);
  const shippingNet = 160; // wysyłka paletowa (netto)
  const totalGross = subtotalNet * 1.23 + shippingNet;

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (payMethod === "stripe") {
      try {
        setLoading(true);
        const enriched: GroupedCartItems[] = groupedItems.map((it) => ({
          ...it,
          product: {
            ...it.product,
            price: computeUnitFullPrice(it.product),
            name: it.product?.title || it.product?.name,
          },
         }));
        const secret = await fetchStripeClientSecret(enriched);
        if (!secret) {
          alert("Nie udało się zainicjować płatności. Spróbuj ponownie lub wybierz przelew.");
          return;
        }
        setClientSecret(secret);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Dane do przelewu: 51 1140 2004 0000 3602 7800 1733, tytuł: ZAMÓWIENIE #" + Math.floor(Math.random()*100000));
    }
  };

  return (
    <div className="bg-white">
      <Container className="py-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <Title>Finalizacja zamówienia</Title>
        </div>

        <form className="grid lg:grid-cols-3 gap-4 sm:gap-8" onSubmit={handlePlaceOrder}>
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dane zamawiającego</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Imię i nazwisko*</label>
                  <input required className="mt-1 w-full border rounded-md px-3 py-2 text-base" defaultValue={user?.fullName ?? undefined} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">E-mail*</label>
                  <input required type="email" className="mt-1 w-full border rounded-md px-3 py-2 text-base" defaultValue={user?.emailAddresses[0]?.emailAddress ?? undefined} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefon*</label>
                  <input required className="mt-1 w-full border rounded-md px-3 py-2 text-base" placeholder="+48 600 000 000" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adres dostawy</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Ulica i numer*</label>
                  <input required className="mt-1 w-full border rounded-md px-3 py-2 text-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kod pocztowy*</label>
                  <input required className="mt-1 w-full border rounded-md px-3 py-2 text-base" placeholder="00-000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Miasto*</label>
                  <input required className="mt-1 w-full border rounded-md px-3 py-2 text-base" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Województwo*</label>
                  <select required className="mt-1 w-full border rounded-md px-3 py-2 text-base bg-white">
                    <option value="">Wybierz</option>
                    {[
                      "dolnośląskie","kujawsko-pomorskie","lubelskie","lubuskie","łódzkie","małopolskie","mazowieckie","opolskie","podkarpackie","podlaskie","pomorskie","śląskie","świętokrzyskie","warmińsko-mazurskie","wielkopolskie","zachodniopomorskie",
                    ].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
            </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metoda płatności</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue={payMethod} onValueChange={(v: "stripe" | "transfer") => setPayMethod(v)}>
                  <div className="flex items-start gap-2">
                    <RadioGroupItem value="stripe" id="pm-stripe" />
                    <Label htmlFor="pm-stripe" className="text-sm">Stripe (karta, BLIK) – Bezpieczne płatności kartą lub BLIKiem</Label>
                  </div>
                  <div className="flex items-start gap-2 mt-2">
                    <RadioGroupItem value="transfer" id="pm-transfer" />
                    <Label htmlFor="pm-transfer" className="text-sm">Przelew tradycyjny – przelew na konto: 51 1140 2004 0000 3602 7800 1733</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zgody i regulaminy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="flex items-start gap-2 text-sm">
                  <input type="checkbox" required className="mt-1" />
                  <span>Akceptuję <Link href="/regulamin" className="text-[var(--color-brand-orange)] hover:underline">Regulamin sklepu</Link></span>
                </label>
                <label className="flex items-start gap-2 text-sm">
                  <input type="checkbox" required className="mt-1" />
                  <span>Oświadczam, że zapoznałem się z <Link href="/polityka-prywatnosci" className="text-[var(--color-brand-orange)] hover:underline">Polityką Prywatności</Link></span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button type="submit" disabled={loading} className="bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)]">
                    {loading ? "Proszę czekać..." : "Zapłać i Złóż zamówienie"}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/cart">Wróć do koszyka</Link>
                  </Button>
                </div>
                <p className="text-xs text-gray-600">Twoje dane są chronione. Certyfikat SSL, 3D Secure, PCI DSS.</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar podsumowania */}
          <div className="lg:sticky lg:top-6">
            <Card>
              <CardHeader>
                <CardTitle>Podsumowanie zamówienia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {groupedItems.map(({ product, quantity }) => (
                    <div key={product._id} className="flex items-center gap-3">
                      {(() => {
                        const toSrc = (img: any): string | null => {
                          if (!img) return null;
                          if (typeof img === "string") return img || null;
                          if (typeof img === "object" && img.url) return img.url || null;
                          if (typeof img === "object" && img.asset?._ref) {
                            try { return urlFor(img).width(96).height(96).fit("crop").url(); } catch { return null; }
                          }
                          return null;
                        };
                        const img = Array.isArray(product?.images) ? product.images[0] : null;
                        const src = toSrc(img);
                        return src ? (
                          <Image src={src} alt={product?.name || ""} width={48} height={48} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-12 rounded bg-gray-100" />
                        );
                      })()}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{product?.title || product?.name}</p>
                        <p className="text-xs text-gray-600">Ilość: {quantity}</p>
                      </div>
                      <div className="text-sm font-semibold">
                        {computeUnitFullPrice(product) * quantity}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span>Suma częściowa (netto)</span>
                  <PriceFormatter amount={subtotalNet} />
                </div>
                <div className="flex items-center justify-between">
                  <span>VAT (23%)</span>
                  <PriceFormatter amount={subtotalNet * 0.23} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Suma częściowa (brutto)</span>
                  <PriceFormatter amount={subtotalNet * 1.23} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Wysyłka paletowa (netto)</span>
                  <PriceFormatter amount={shippingNet} />
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span>RAZEM do zapłaty (brutto)</span>
                  <PriceFormatter amount={totalGross} />
                </div>
                {/* Embedded Stripe Checkout mounts here when clientSecret exists */}
                {clientSecret && (
                  <div className="mt-4 border rounded-xl p-3">
                    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
                      <EmbeddedCheckout />
                    </EmbeddedCheckoutProvider>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </form>
      </Container>
    </div>
  );
}


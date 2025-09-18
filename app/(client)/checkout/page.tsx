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
import { client } from "@/sanity/lib/client";
// hosted checkout (new tab)

// removed embedded checkout; using hosted redirect
import { useUser } from "@clerk/nextjs";

export default function CheckoutPage() {
  const groupedItems = useStore((s) => s.getGroupedItems());
  const { user } = useUser();
  const [payMethod] = useState<"stripe">("stripe");
  const [loading, setLoading] = useState(false);
  // no embedded client secret

  type CartProduct = {
    basePrice?: number;
    price?: number | string;
    pricing?: { priceNet?: number | string };
    title?: string;
    name?: string;
    _id?: string;
    images?: Array<{ asset?: { _ref?: string } } | string>;
  };
  const computeUnitNet = useCallback((product: CartProduct, configuration?: GroupedCartItems["configuration"]) => {
    const priceCandidate =
      (typeof product?.pricing?.priceNet === 'number' ? product.pricing.priceNet : (typeof product?.pricing?.priceNet === 'string' ? parseFloat(product.pricing.priceNet) : undefined)) ??
      (typeof product?.basePrice === 'number' ? product.basePrice : undefined) ??
      (typeof product?.price === 'string' ? parseFloat(product.price) : (typeof product?.price === 'number' ? product.price : 0));
    const baseNet = Number.isFinite(priceCandidate as number) ? (priceCandidate as number) : 0;
    const mount = configuration?.mount?.price ?? 0;
    const drill = configuration?.drill?.price ?? 0;
    const teeth = configuration?.teeth?.enabled ? (configuration?.teeth?.price ?? 0) : 0;
    return baseNet + (Number(mount) || 0) + (Number(drill) || 0) + (Number(teeth) || 0);
  }, []);

  const subtotalNet = useMemo(
    () => groupedItems.reduce((sum, it) => sum + computeUnitNet(it.product as any, it.configuration) * it.quantity, 0),
    [groupedItems, computeUnitNet]
  );

  // Fallback price map for items that resolve to 0 (e.g., legacy items in cart)
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});
  useEffect(() => {
    const missing = groupedItems
      .filter((it) => (computeUnitNet(it.product as any, it.configuration) || 0) <= 0)
      .map((it) => (it.product as any)?._id)
      .filter(Boolean) as string[];
    const toFetch = [...new Set(missing)].filter((id) => !priceMap[id]);
    if (toFetch.length === 0) return;
    (async () => {
      try {
        const docs: Array<{ _id: string; pricing?: { priceNet?: number | string }; priceNet?: number | string; basePrice?: number; price?: number | string }> = await client.fetch(
          `*[_type=="product" && _id in $ids]{ _id, pricing, priceNet, basePrice, price }`,
          { ids: toFetch }
        );
        const next: Record<string, number> = { ...priceMap };
        docs.forEach((d) => {
          const cand =
            (typeof d?.pricing?.priceNet === 'number' ? d.pricing!.priceNet : (typeof d?.pricing?.priceNet === 'string' ? parseFloat(d.pricing!.priceNet as string) : undefined)) ??
            (typeof d?.priceNet === 'number' ? (d.priceNet as number) : (typeof d?.priceNet === 'string' ? parseFloat(d.priceNet as string) : undefined)) ??
            (typeof d?.basePrice === 'number' ? d.basePrice : undefined) ??
            (typeof d?.price === 'number' ? (d.price as number) : (typeof d?.price === 'string' ? parseFloat(d.price as string) : 0));
          next[d._id] = Number.isFinite(cand as number) ? (cand as number) : 0;
        });
        setPriceMap(next);
      } catch {}
    })();
  }, [groupedItems, priceMap, computeUnitNet]);

  const computeExtras = (cfg?: GroupedCartItems["configuration"]) => {
    return (cfg?.mount?.price ?? 0) + (cfg?.drill?.price ?? 0) + (cfg?.teeth?.enabled ? (cfg?.teeth?.price ?? 0) : 0);
  };
  const shippingNet = 160; // wysyłka paletowa (netto)
  const totalGross = subtotalNet * 1.23 + shippingNet;

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const enriched: GroupedCartItems[] = groupedItems.map((it) => ({
        ...it,
        product: {
          ...it.product,
          price: computeUnitNet(it.product as any, it.configuration),
          name: it.product?.title || it.product?.name,
        },
       }));
      const hostedUrl = await createCheckoutSession(enriched as any, {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? 'Unknown',
        customerEmail: user?.emailAddresses[0]?.emailAddress ?? 'Unknown',
        clerkUserId: user?.id,
        address: null,
      })
      if (!hostedUrl) {
        alert('Nie udało się zainicjować płatności. Spróbuj ponownie.');
        return;
      }
      window.open(hostedUrl, '_blank', 'noopener');
    } finally {
      setLoading(false);
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
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 p-3 rounded-xl border bg-white">
                  <input type="radio" checked readOnly className="mt-1 h-4 w-4 accent-[var(--color-brand-orange)]" aria-label="Stripe (karta, BLIK)" />
                  <div className="text-sm">
                    <div className="font-medium">Stripe (karta, BLIK)</div>
                    <div className="text-gray-600">Bezpieczne płatności kartą / BLIK / Apple Pay / Google Pay</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">
                  Przelew tradycyjny – przelew na konto: <span className="font-semibold">51 1140 2004 0000 3602 7800 1733</span>. Jeśli wolisz przelew, skontaktuj się z nami – przygotujemy proformę.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zgody i regulaminy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-3 rounded-xl border bg-white hover:bg-gray-50 transition-colors cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-brand-orange)]"
                      aria-describedby="consent-terms-help"
                    />
                    <span className="leading-5">
                      Akceptuję
                      {' '}
                      <Link href="/regulamin" className="text-[var(--color-brand-orange)] hover:underline font-medium">Regulamin sklepu</Link>
                      {' '}
                      <span className="ml-2 text-[10px] uppercase tracking-wide text-gray-500">Wymagane</span>
                    </span>
                  </label>
                  <label className="flex items-start gap-3 p-3 rounded-xl border bg-white hover:bg-gray-50 transition-colors cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-brand-orange)]"
                      aria-describedby="consent-privacy-help"
                    />
                    <span className="leading-5">
                      Oświadczam, że zapoznałem się z
                      {' '}
                      <Link href="/polityka-prywatnosci" className="text-[var(--color-brand-orange)] hover:underline font-medium">Polityką Prywatności</Link>
                      {' '}
                      <span className="ml-2 text-[10px] uppercase tracking-wide text-gray-500">Wymagane</span>
                    </span>
                  </label>
                  <p id="consent-terms-help" className="sr-only">Zaznacz, aby zaakceptować regulamin sklepu.</p>
                  <p id="consent-privacy-help" className="sr-only">Zaznacz, aby potwierdzić zapoznanie się z Polityką Prywatności.</p>
                </div>
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
                  {groupedItems.map(({ product, quantity, configuration }) => (
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
                        <PriceFormatter amount={(computeUnitNet(product as any, configuration) || priceMap[(product as any)?._id] || 0) * quantity} />
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


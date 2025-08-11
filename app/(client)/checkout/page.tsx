"use client";

import Container from "@/components/Container";
import Title from "@/components/Title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PriceFormatter from "@/components/PriceFormatter";
import useStore from "@/store";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { createCheckoutSession, Metadata, GroupedCartItems } from "@/actions/createCheckoutSession";
import { useUser } from "@clerk/nextjs";

export default function CheckoutPage() {
  const groupedItems = useStore((s) => s.getGroupedItems());
  const { user } = useUser();
  const [payMethod, setPayMethod] = useState<"stripe" | "transfer">("stripe");
  const [loading, setLoading] = useState(false);

  type CartProduct = {
    basePrice?: number;
    price?: number;
    toothCost?: number;
    toothQty?: number;
    title?: string;
    name?: string;
    _id?: string;
    images?: Array<{ asset?: { _ref?: string } } | string>;
  };
  const computeUnitFullPrice = (product: CartProduct) => {
    const base = typeof product?.basePrice === "number" ? product.basePrice : (product?.price ?? 0);
    const toothCost = typeof product?.toothCost === "number" ? product.toothCost : 0;
    const toothQty = typeof product?.toothQty === "number" ? product.toothQty : 0;
    return base + toothCost * toothQty;
  };

  const subtotal = useMemo(() => groupedItems.reduce((sum, it) => sum + computeUnitFullPrice(it.product) * it.quantity, 0), [groupedItems, computeUnitFullPrice]);
  const shipping = subtotal >= 1000 ? 0 : 39;
  const total = subtotal + shipping;

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
        const metadata: Metadata = {
          orderNumber: crypto.randomUUID(),
          customerName: user?.fullName ?? "Unknown",
          customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
        };
        const url = await createCheckoutSession(enriched, metadata);
        if (url) window.location.href = url;
      } finally {
        setLoading(false);
      }
    } else {
      alert("Dane do przelewu: 51 1140 2004 0000 3602 7800 1733, tytuł: ZAMÓWIENIE #" + Math.floor(Math.random()*100000));
    }
  };

  return (
    <div className="bg-white">
      <Container className="py-8">
        <div className="mb-6">
          <Title>Finalizacja zamówienia</Title>
        </div>

        <form className="grid lg:grid-cols-3 gap-8" onSubmit={handlePlaceOrder}>
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dane zamawiającego</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Imię i nazwisko*</label>
                  <input required className="mt-1 w-full border rounded-md px-3 py-2" defaultValue={user?.fullName ?? ""} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">E-mail*</label>
                  <input required type="email" className="mt-1 w-full border rounded-md px-3 py-2" defaultValue={user?.emailAddresses[0]?.emailAddress ?? ""} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefon*</label>
                  <input required className="mt-1 w-full border rounded-md px-3 py-2" placeholder="+48 600 000 000" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adres dostawy</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Ulica i numer*</label>
                  <input required className="mt-1 w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kod pocztowy*</label>
                  <input required className="mt-1 w-full border rounded-md px-3 py-2" placeholder="00-000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Miasto*</label>
                  <input required className="mt-1 w-full border rounded-md px-3 py-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Województwo*</label>
                  <select required className="mt-1 w-full border rounded-md px-3 py-2 bg-white">
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
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="stripe" id="pm-stripe" />
                    <Label htmlFor="pm-stripe">Stripe (karta, BLIK) – Bezpieczne płatności kartą lub BLIKiem</Label>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <RadioGroupItem value="transfer" id="pm-transfer" />
                    <Label htmlFor="pm-transfer">Przelew tradycyjny – przelew na konto: 51 1140 2004 0000 3602 7800 1733</Label>
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
                  <span>Oświadczam, że zapoznałem się z <Link href="/privacy" className="text-[var(--color-brand-orange)] hover:underline">Polityką Prywatności</Link></span>
                </label>
                <div className="flex gap-3">
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
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Podsumowanie zamówienia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {groupedItems.map(({ product, quantity }) => (
                    <div key={product._id} className="flex items-center gap-3">
                      {product?.images?.[0] && (
                        <Image src={product.images[0].asset?._ref ? "" : ""} alt="" width={48} height={48} className="w-12 h-12 object-cover rounded" />
                      )}
                      <div className="flex-1">
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
                  <span>Suma częściowa</span>
                  <PriceFormatter amount={subtotal} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Koszt wysyłki</span>
                  {shipping === 0 ? <span className="text-green-600 font-medium">Darmowa dostawa</span> : <PriceFormatter amount={shipping} />}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span>RAZEM do zapłaty</span>
                  <PriceFormatter amount={total} />
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Container>
    </div>
  );
}


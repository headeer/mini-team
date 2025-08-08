import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/sanity/queries";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import { CornerDownLeft, Shield, StarIcon, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";

const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return notFound();
  }
  // Podobne produkty wg marki lub kategorii
  const similarQuery = `*[_type=="product" && slug.current != $slug && defined(brand) && brand._ref == $brand][0...3]{..., "slug": slug.current}`;
  const fallbackSimilarQuery = `*[_type=="product" && slug.current != $slug][0...3]{..., "slug": slug.current}`;
  const similar = await client.fetch(
    product?.brand?._ref ? similarQuery : fallbackSimilarQuery,
    { slug, brand: product?.brand?._ref }
  );
  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <Container className="py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[var(--color-brand-orange)]">Start</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[var(--color-brand-orange)]">Oferta</Link>
            <span>/</span>
            <span className="text-gray-900 line-clamp-1">{product?.name}</span>
          </div>
        </Container>
      </div>
      <Container className="py-10">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left: images + trust */}
          <div>
            {product?.images && (
              <ImageView images={product?.images} isStock={product?.stock} />
            )}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-1">⚡ Dostawa Ekspresowa</h3>
              <p className="text-sm text-green-700">Zamów do 14:00 – dostawa jutro!</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-green-700">
                <span>✓ Darmowa dostawa</span>
                <span>✓ Zwrot 14 dni</span>
                <span>✓ Ubezpieczenie</span>
              </div>
            </div>
          </div>

          {/* Right: info + price + specs + order */}
          <div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product?.name}</h1>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-red-600 text-white">HARDOX HB500</Badge>
                <Badge className="bg-green-600 text-white">2 LATA GWARANCJI</Badge>
              </div>
              <div className="flex items-center gap-0.5 text-xs">
                {[...Array(5)].map((_, index) => (
                  <StarIcon key={index} size={12} className="text-shop_light_green" fill="#3b9c3c" />
                ))}
                <p className="font-semibold">(127 opinii)</p>
              </div>
            </div>
            <div className="space-y-2 border-t border-b border-gray-200 py-5">
              <PriceView price={product?.price} discount={product?.discount} className="text-2xl font-bold" />
              <p className={`px-4 py-1.5 text-sm inline-block font-semibold rounded-lg ${product?.stock === 0 ? "bg-red-100 text-red-600" : "text-green-600 bg-green-100"}`}>
                {(product?.stock as number) > 0 ? `W magazynie: ${product?.stock}` : "Brak w magazynie"}
              </p>
            </div>
            <div className="flex items-center gap-3 my-4">
              <AddToCartButton product={product} />
              <FavoriteButton showProduct={true} product={product} />
            </div>

            {/* Specyfikacja techniczna */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Specyfikacja techniczna</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    {product?.specifications?.widthCm && (
                      <div>
                        <span className="text-gray-600">Szerokość robocza:</span>
                        <span className="font-semibold ml-2">{product.specifications.widthCm} cm</span>
                      </div>
                    )}
                    {product?.specifications?.pinDiameterMm && (
                      <div>
                        <span className="text-gray-600">Średnica sworznia:</span>
                        <span className="font-semibold ml-2">{product.specifications.pinDiameterMm} mm</span>
                      </div>
                    )}
                    {product?.specifications?.volumeM3 && (
                      <div>
                        <span className="text-gray-600">Pojemność:</span>
                        <span className="font-semibold ml-2">{product.specifications.volumeM3} m³</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {product?.specifications?.quickCoupler && (
                      <div>
                        <span className="text-gray-600">Szybkozłącze:</span>
                        <span className="font-semibold ml-2">{product.specifications.quickCoupler}</span>
                      </div>
                    )}
                    {product?.specifications?.machineCompatibility?.length ? (
                      <div>
                        <span className="text-gray-600">Kompatybilność:</span>
                        <span className="font-semibold ml-2">{product.specifications.machineCompatibility.join(", ")}</span>
                      </div>
                    ) : null}
                  </div>
                  {product?.specifications?.features?.length ? (
                    <div className="col-span-full mt-2 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Cechy:</h4>
                      <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                        {product.specifications.features.map((f: string, i: number) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {/* Zamów w 60 sekund */}
            <Card className="bg-gradient-to-br from-[var(--color-brand-orange)]/10 to-[var(--color-brand-red)]/10 border-[var(--color-brand-orange)]/20">
              <CardHeader>
                <CardTitle className="text-xl text-[var(--color-brand-red)]">Zamów w 60 sekund</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Imię i nazwisko" />
                <Input placeholder="Numer telefonu" />
                <Input placeholder="Adres email" />
                <Button className="w-full bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)]">ZAMAWIAM - DOSTAWA 48H</Button>
                <div className="text-xs text-gray-600 flex items-center gap-2"><Shield className="h-4 w-4" />🔒 Bezpieczne zamówienie | 📋 Faktura VAT</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar products */}
        {similar?.length ? (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Podobne produkty</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {similar.map((p: any) => (
                <Card key={p._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    {p?.images?.[0] ? (
                      <img src={p.images[0].asset?._ref ? "" : p.images[0]} alt={p.name} className="w-full h-32 object-cover" />
                    ) : (
                      <div className="w-full h-32 bg-gray-100" />
                    )}
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{p.name}</h3>
                    <PriceView price={p.price} discount={p.discount} />
                    <Link href={`/product/${p.slug}`} className="inline-block mt-2 text-sm underline underline-offset-2">Zobacz produkt</Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </div>
  );
};

export default SingleProductPage;

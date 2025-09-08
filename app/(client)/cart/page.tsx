"use client";

import {
  createCheckoutSession,
  Metadata,
} from "@/actions/createCheckoutSession";
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccess from "@/components/NoAccess";
import PriceFormatter from "@/components/PriceFormatter";
import ProductSideMenu from "@/components/ProductSideMenu";
import QuantityButtons from "@/components/QuantityButtons";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Address } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import useStore from "@/store";
// import { useAuth, useUser } from "@clerk/nextjs";
import { ShoppingBag, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { backendClient } from "@/sanity/lib/backendClient";
import toast from "react-hot-toast";

const CartPage = () => {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
  } = useStore();
  const [loading, setLoading] = useState(false);
  const groupedItems = useStore((state) => state.getGroupedItems());
  // const { isSignedIn } = useAuth();
  // const { user } = useUser();
  const isSignedIn = false; // Temporarily disabled
  const user = null; // Temporarily disabled
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const query = `*[_type=="address"] | order(publishedAt desc)`;
      const data = await client.fetch(query);
      setAddresses(data);
      const defaultAddress = data.find((addr: Address) => addr.default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (data.length > 0) {
        setSelectedAddress(data[0]); // Optional: select first address if no default
      }
    } catch (error) {
      console.log("Addresses fetching error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleCreateAddress = async () => {
    if (!user) return toast.error("Zaloguj się, aby dodać adres");
    try {
      setAddingAddress(true);
      const doc = {
        _type: "address",
        name: newAddress.name || user.fullName || "",
        email: user.emailAddresses[0]?.emailAddress || "",
        address: newAddress.address || "",
        city: newAddress.city || "",
        state: newAddress.state || "",
        zip: newAddress.zip || "",
        default: !addresses || addresses.length === 0,
      } as any;
      const created = await backendClient.create(doc);
      toast.success("Adres dodany");
      setAddingAddress(false);
      setNewAddress({});
      await fetchAddresses();
      setSelectedAddress(created as Address);
    } catch {
      setAddingAddress(false);
      toast.error("Nie udało się dodać adresu");
    }
  };
  const handleResetCart = () => {
    const confirmed = window.confirm("Na pewno chcesz wyczyścić koszyk?");
    if (confirmed) {
      resetCart();
      toast.success("Koszyk został wyczyszczony");
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
        clerkUserId: user?.id,
        address: selectedAddress,
      };
      const checkoutUrl = await createCheckoutSession(groupedItems, metadata);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-gray-50 pb-52 md:pb-10">
      {isSignedIn ? (
        <Container>
          {groupedItems?.length ? (
            <>
              <div className="flex items-center justify-between py-5">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-darkColor" />
                  <Title>Twój koszyk</Title>
                </div>
                {groupedItems?.length > 0 && (
                  <Button onClick={handleResetCart} variant="destructive" size="sm" className="inline-flex items-center gap-2">
                    <Trash className="w-4 h-4" /> Usuń wszystkie
                  </Button>
                )}
              </div>
              <div className="grid lg:grid-cols-3 md:gap-8">
                <div className="lg:col-span-2 rounded-lg">
                  <div className="border bg-white rounded-md">
                    {groupedItems?.map(({ product, configuration }) => {
                      const itemCount = getItemCount(product?._id);
                      return (
                        <div
                          key={product?._id}
                          className="border-b p-2.5 last:border-b-0 flex items-center justify-between gap-5"
                        >
                          <div className="flex flex-1 items-start gap-2 h-36 md:h-44">
                            {product?.images && (
                              <Link
                                href={`/product/${product?.slug?.current}`}
                                className="border p-0.5 md:p-1 mr-2 rounded-md
                                 overflow-hidden group"
                              >
                                {(() => { 
                                  const toSrc = (img: any): string | null => {
                                    if (!img) return null;
                                    if (typeof img === "string") return img || null;
                                    if (typeof img === "object" && img.url) return img.url || null;
                                    if (typeof img === "object" && img.asset?._ref) {
                                      try { return urlFor(img).url(); } catch { return null; }
                                    }
                                    return null;
                                  };
                                  const src = toSrc(product?.images?.[0]);
                                  return src ? (
                                    <Image
                                      src={src}
                                      alt="productImage"
                                      width={500}
                                      height={500}
                                      loading="lazy"
                                      className="w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 hoverEffect"
                                    />
                                  ) : (
                                    <div className="w-32 md:w-40 h-32 md:h-40 bg-gray-100" />
                                  );
                                })()}
                              </Link>
                            )}
                            <div className="h-full flex flex-1 flex-col justify-between py-1">
                              <div className="flex flex-col gap-0.5 md:gap-1.5">
                                <h2 className="text-base font-semibold line-clamp-1">
                                  {product?.title || product?.name}
                                </h2>
                                <p className="text-sm text-gray-600">
                                  Parametry: {product?.priceTier || "—"}
                                  {product?.specifications?.widthCm ? `, ${product.specifications.widthCm} cm` : ""}
                                  {product?.specifications?.quickCoupler ? `, ${product.specifications.quickCoupler}` : ""}
                                </p>
                                {configuration ? (
                                  <div className="text-sm text-gray-700 space-y-1">
                                    {configuration.mount?.title ? (
                                      <div>
                                        <span className="font-medium">{configuration.mount.title}</span>
                                        {typeof configuration.mount.price === "number" ? (
                                          <span className="text-gray-600 ml-2">{configuration.mount.price} zł netto</span>
                                        ) : null}
                                      </div>
                                    ) : null}
                                    {configuration.drill?.title ? (
                                      <div>
                                        <span className="font-medium">{configuration.drill.title}</span>
                                        {typeof configuration.drill.price === "number" ? (
                                          <span className="text-gray-600 ml-2">{configuration.drill.price} zł netto</span>
                                        ) : null}
                                      </div>
                                    ) : null}
                                    {configuration.teeth?.enabled ? (
                                      <div>
                                        <span className="font-medium">Zęby</span>
                                        {typeof configuration.teeth.price === "number" ? (
                                          <span className="text-gray-600 ml-2">{configuration.teeth.price} zł netto</span>
                                        ) : null}
                                      </div>
                                    ) : null}
                                    <Link href={`/product/${product?.slug?.current}#konfigurator`} className="text-xs text-[var(--color-brand-orange)] underline">
                                      Zmień konfigurację
                                    </Link>
                                  </div>
                                ) : null}
                              </div>
                              <div className="flex items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <ProductSideMenu
                                        product={product}
                                        className="relative top-0 right-0"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold">
                                      Dodaj do ulubionych
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Trash
                                        onClick={() => {
                                          deleteCartProduct(product?._id);
                                          toast.success(
                                            "Product deleted successfully!"
                                          );
                                        }}
                                        className="w-4 h-4 md:w-5 md:h-5 mr-1 text-gray-500 hover:text-red-600 hoverEffect"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold bg-red-600">
                                      Usuń produkt
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-start justify-between h-36 md:h-44 p-0.5 md:p-1">
                            <div className="text-right">
                              <div className="text-sm text-gray-600">netto</div>
                              <PriceFormatter
                                amount={(product?.price as number) * itemCount}
                                className="font-bold text-lg"
                              />
                              <div className="text-sm text-gray-600">brutto</div>
                              <PriceFormatter
                                amount={(product?.price as number) * itemCount * 1.23}
                                className="font-semibold text-base text-gray-700"
                              />
                            </div>
                            <QuantityButtons product={product} />
                          </div>
                        </div>
                      );
                    })}
                    <div className="px-5 pb-4">
                      <Button
                        onClick={handleResetCart}
                        className="font-semibold w-full"
                        variant="destructive"
                      >
                        Usuń wszystkie produkty z koszyka
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="lg:col-span-1">
                    <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
                      <h2 className="text-xl font-semibold mb-4">
                        Podsumowanie zamówienia
                      </h2>
                      
                      {/* Configuration Summary */}
                      {groupedItems.some(item => item.configuration) && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold mb-3 text-gray-800">Wybrane konfiguracje</h3>
                          <div className="space-y-3">
                            {groupedItems.map((item, index) => {
                              if (!item.configuration) return null;
                              return (
                                <div key={index} className="text-sm">
                                  <div className="font-medium text-gray-800 mb-1">{item.product?.name}</div>
                                  <div className="space-y-1 ml-2">
                                    {item.configuration.mount?.title && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-gray-600">{item.configuration.mount.title}</span>
                                        <span className="text-gray-800">{item.configuration.mount.price} zł netto</span>
                                      </div>
                                    )}
                                    {item.configuration.drill?.title && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-gray-600">{item.configuration.drill.title}</span>
                                        <span className="text-gray-800">{item.configuration.drill.price} zł netto</span>
                                      </div>
                                    )}
                                    {item.configuration.teeth?.enabled && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Zęby</span>
                                        <span className="text-gray-800">{item.configuration.teeth.price} zł netto</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Suma częściowa (netto)</span>
                          <PriceFormatter amount={getSubTotalPrice()} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">VAT (23%)</span>
                          <PriceFormatter amount={getSubTotalPrice() * 0.23} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Suma częściowa (brutto)</span>
                          <PriceFormatter amount={getSubTotalPrice() * 1.23} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Koszt wysyłki</span>
                          <span className="text-sm text-gray-600">Obliczany przy kasie</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between font-semibold text-lg">
                          <span>RAZEM</span>
                          <PriceFormatter
                            amount={getTotalPrice()}
                            className="text-lg font-bold text-black"
                          />
                        </div>
                        <Button
                          className="w-full rounded-full font-semibold tracking-wide hoverEffect"
                          size="lg"
                          disabled={loading}
                          onClick={handleCheckout}
                        >
                          {loading ? "Proszę czekać..." : "Przejdź do płatności"}
                        </Button>
                      </div>
                    </div>
                    {addresses && (
                      <div className="bg-white rounded-md mt-5">
                        <Card>
                          <CardHeader>
                            <CardTitle>Adres dostawy</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <RadioGroup
                              defaultValue={addresses
                                ?.find((addr) => addr.default)
                                ?._id.toString()}
                            >
                              {addresses?.map((address) => (
                                <div
                                  key={address?._id}
                                  onClick={() => setSelectedAddress(address)}
                                  className={`flex items-center space-x-2 mb-4 cursor-pointer ${selectedAddress?._id === address?._id && "text-shop_dark_green"}`}
                                >
                                  <RadioGroupItem
                                    value={address?._id.toString()}
                                  />
                                  <Label
                                    htmlFor={`address-${address?._id}`}
                                    className="grid gap-1.5 flex-1"
                                  >
                                    <span className="font-semibold">
                                      {address?.name}
                                    </span>
                                    <span className="text-sm text-black/60">
                                      {address.address}, {address.city},{" "}
                                      {address.state} {address.zip}
                                    </span>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                            <div className="grid grid-cols-1 gap-2 mt-2">
                              <input className="border rounded-md px-3 py-2" placeholder="Imię i nazwisko" value={newAddress.name || ""} onChange={(e)=>setNewAddress(v=>({...v,name:e.target.value}))} />
                              <input className="border rounded-md px-3 py-2" placeholder="Ulica i numer" value={newAddress.address || ""} onChange={(e)=>setNewAddress(v=>({...v,address:e.target.value}))} />
                              <div className="grid grid-cols-2 gap-2">
                                <input className="border rounded-md px-3 py-2" placeholder="Miasto" value={newAddress.city || ""} onChange={(e)=>setNewAddress(v=>({...v,city:e.target.value}))} />
                                <input className="border rounded-md px-3 py-2" placeholder="Województwo" value={newAddress.state || ""} onChange={(e)=>setNewAddress(v=>({...v,state:e.target.value}))} />
                              </div>
                              <input className="border rounded-md px-3 py-2" placeholder="Kod pocztowy" value={newAddress.zip || ""} onChange={(e)=>setNewAddress(v=>({...v,zip:e.target.value}))} />
                              <Button onClick={handleCreateAddress} disabled={addingAddress} className="w-full mt-1">
                                {addingAddress ? "Dodaję..." : "Dodaj nowy adres"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
                {/* Order summary for mobile view */}
                <div className="md:hidden fixed bottom-0 left-0 w-full bg-white pt-2">
                  <div className="bg-white p-3 rounded-t-2xl border-t border-x mx-2 shadow-[0_-6px_20px_rgba(0,0,0,0.06)]">
                    <details>
                      <summary className="list-none cursor-pointer select-none">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-gray-600">Zobacz koszyk</div>
                            <div className="text-base font-semibold">Razem</div>
                          </div>
                          <PriceFormatter amount={getTotalPrice()} className="text-lg font-bold text-black" />
                        </div>
                      </summary>
                      {/* Configuration Summary for Mobile */}
                      {groupedItems.some(item => item.configuration) && (
                        <div className="mt-3 mb-3 p-3 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold mb-2 text-gray-800 text-sm">Wybrane konfiguracje</h3>
                          <div className="space-y-2">
                            {groupedItems.map((item, index) => {
                              if (!item.configuration) return null;
                              return (
                                <div key={index} className="text-xs">
                                  <div className="font-medium text-gray-800 mb-1">{item.product?.name}</div>
                                  <div className="space-y-1 ml-2">
                                    {item.configuration.mount?.title && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-gray-600">{item.configuration.mount.title}</span>
                                        <span className="text-gray-800">{item.configuration.mount.price} zł netto</span>
                                      </div>
                                    )}
                                    {item.configuration.drill?.title && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-gray-600">{item.configuration.drill.title}</span>
                                        <span className="text-gray-800">{item.configuration.drill.price} zł netto</span>
                                      </div>
                                    )}
                                    {item.configuration.teeth?.enabled && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Zęby</span>
                                        <span className="text-gray-800">{item.configuration.teeth.price} zł netto</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-3 mt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Suma częściowa (netto)</span>
                          <PriceFormatter amount={getSubTotalPrice()} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">VAT (23%)</span>
                          <PriceFormatter amount={getSubTotalPrice() * 0.23} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Suma częściowa (brutto)</span>
                          <PriceFormatter amount={getSubTotalPrice() * 1.23} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Koszt wysyłki</span>
                          <span className="text-sm text-gray-600">Obliczany przy kasie</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between font-semibold text-lg">
                          <span>RAZEM</span>
                          <PriceFormatter
                            amount={getTotalPrice()}
                            className="text-lg font-bold text-black"
                          />
                        </div>
                      </div>
                    </details>
                    <Button
                      className="mt-3 w-full rounded-full font-semibold tracking-wide hoverEffect"
                      size="lg"
                      disabled={loading}
                      onClick={handleCheckout}
                    >
                      {loading ? "Proszę czekać..." : "Przejdź do płatności"}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EmptyCart />
          )}
        </Container>
      ) : (
        <NoAccess />
      )}
    </div>
  );
};

export default CartPage;

"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/sanity.types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import useStore from "@/store";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";
import QuickConfigModal from "./QuickConfigModal";
import { urlFor } from "@/sanity/lib/image";

interface Props {
  product: Product;
  className?: string;
  compact?: boolean; // compact summary for cards (shop)
  extraConfiguration?: {
    dimensions?: { A?: number; B?: number; C?: number; D?: number };
    photoAssetId?: string;
    teeth?: { enabled: boolean; price?: number };
    mount?: string;
    machine?: { brandModel?: string; weight?: number | string };
    requireMountValidation?: boolean;
    hasQuickCoupler?: boolean;
  };
  disabled?: boolean;
  size?: 'sm' | 'md';
  alwaysButton?: boolean; // force button even if item already in cart
}

const AddToCartButton = ({ product, className, compact = false, extraConfiguration, disabled = false, size = 'md', alwaysButton = false }: Props) => {
  const { addItem, addConfiguredItem, getItemCount } = useStore();
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [showConfigModal, setShowConfigModal] = React.useState(false);
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);
  const computedItemCount = getItemCount(product?._id);
  const itemCount = isHydrated ? computedItemCount : 0;
  const isOutOfStock = typeof product?.stock === 'number' && product.stock === 0;
  const explicitPhoneOnly = ((product as unknown as { phoneOrderOnly?: boolean | string })?.phoneOrderOnly === true);
  // Only treat as phone order when explicit flag is set
  const isPhoneOnly = explicitPhoneOnly;

  const getNetPrice = React.useCallback((p: Product) => {
    const anyP = p as any;
    const candidate = anyP?.pricing?.priceNet ?? anyP?.priceNet ?? anyP?.basePrice ?? anyP?.price ?? 0;
    const num = typeof candidate === 'string' ? parseFloat(candidate) : Number(candidate);
    return Number.isFinite(num) ? num : 0;
  }, []);

  const handleAddToCart = () => {
    if (disabled) return;
    
    // Check if product needs configuration
    const needsConfig = (product as any)?.mountSystems?.length > 0 || (product as any)?.drillBits?.length > 0;
    const needsDims = (product as any)?.teethEnabled && !extraConfiguration?.dimensions;
    const hasConfig = extraConfiguration?.mount || (extraConfiguration as any)?.drill || extraConfiguration?.teeth?.enabled;

    // Inline validation for mount/dimensions when required by caller (e.g., buckets)
    if (extraConfiguration?.requireMountValidation) {
      const mountSelected = Boolean(extraConfiguration?.mount && extraConfiguration.mount !== 'INNE');
      const dims = extraConfiguration?.dimensions || {};
      const allDimsProvided = ['A','B','C','D'].every((k) => typeof (dims as any)[k] === 'number' && !Number.isNaN((dims as any)[k]));
      const hasQuickCoupler = Boolean(extraConfiguration?.hasQuickCoupler);
      if (hasQuickCoupler) {
        // With quick coupler: require selecting a standard mount; if user chose INNE, require dimensions
        if (!mountSelected) {
          if (extraConfiguration?.mount === 'INNE') {
            if (!allDimsProvided) {
              toast.error('Uzupełnij A/B/C/D dla opcji INNE');
              return;
            }
          } else {
            toast.error('Wybierz mocowanie');
            return;
          }
        }
      } else {
        // Without quick coupler: require dimensions A/B/C/D
        if (!allDimsProvided) {
          toast.error('Uzupełnij A/B/C/D');
          return;
        }
      }
    }
    
    // If product needs configuration and none provided, show modal
    if ((needsConfig || needsDims) && !hasConfig) {
      setShowConfigModal(true);
      return;
    }
    
    const stock = typeof product?.stock === 'number' ? product.stock : Infinity; // If no stock limit, allow unlimited
    if (stock > itemCount) {
      const hasDims = !!extraConfiguration?.dimensions && Object.values(extraConfiguration.dimensions || {}).some((v) => typeof v === 'number' && !Number.isNaN(v as number));
      if (hasDims || extraConfiguration?.photoAssetId || extraConfiguration?.teeth?.enabled || extraConfiguration?.mount || extraConfiguration?.machine) {
        addConfiguredItem(product, { 
          dimensions: extraConfiguration?.dimensions, 
          photoAssetId: extraConfiguration?.photoAssetId, 
          teeth: extraConfiguration?.teeth,
          mount: extraConfiguration?.mount,
          machine: extraConfiguration?.machine,
        } as any);
      } else {
        addItem(product);
      }
      toast.success(`${product?.name?.substring(0, 12)}... dodano do koszyka`);
    } else {
      toast.error("Nie można dodać więcej niż dostępny stan");
    }
  };
  const shouldShowSummary = Boolean(itemCount && !isPhoneOnly && !alwaysButton);
  
  // Check if product needs configuration
  const needsConfiguration = (product as any)?.mountSystems?.length > 0 || (product as any)?.drillBits?.length > 0 || (product as any)?.teethEnabled;

  return (
    <div className="w-full flex items-center">
      {isPhoneOnly ? (
        <Button
          asChild
          disabled
          className={cn(
            "w-full",
            "bg-gray-300 text-gray-600 cursor-not-allowed",
            "text-white font-bold border-0 h-auto rounded-2xl",
            size === 'sm' ? "min-h-10 px-4 py-2 text-sm" : "min-h-12 px-6 py-3",
            className
          )}
        >
          <a href={`tel:+48782851962`}>
            Zamów telefonicznie: 782-851-962
          </a>
        </Button>
      ) : shouldShowSummary ? (
        compact ? (
          <div className="w-full bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
              <QuantityButtons product={product} />
              <div className="text-right w-full xs:w-auto">
                <div className="text-[11px] text-gray-600 leading-none">Razem</div>
                <div className="text-base font-bold text-[var(--color-brand-red)]">
                  <PriceFormatter amount={getNetPrice(product) * itemCount} />
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-end">
              <Link href="/cart" className="text-[11px] font-medium text-gray-700 underline underline-offset-2">Przejdź do koszyka</Link>
            </div>
          </div>
        ) : (
          <div className="w-full bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <QuantityButtons product={product} />
                <span className="text-sm text-gray-700">W koszyku</span>
              </div>
              <div className="text-right w-full sm:w-auto">
                <div className="text-[11px] text-gray-600 leading-none">Razem</div>
                <div className="text-lg font-bold text-[var(--color-brand-red)]">
                  <PriceFormatter amount={getNetPrice(product) * itemCount} />
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-end">
              <Link href="/cart" className="text-xs font-medium text-gray-700 underline underline-offset-2">Przejdź do koszyka</Link>
            </div>
          </div>
        )
      ) : (
        isPhoneOnly ? (
          <Button
            asChild
            disabled={isOutOfStock}
            className={cn(
              "w-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl",
              isOutOfStock 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[var(--color-brand-red)] hover:bg-[var(--color-brand-orange)]",
              "text-white font-bold border-0 h-auto rounded-2xl",
              size === 'sm' ? "min-h-10 px-4 py-2 text-sm" : "min-h-12 px-6 py-3",
              className
            )}
          >
            <a href={`/kontakt?product=${encodeURIComponent(String(product?.name || ''))}`}>
              Zapytaj o ofertę
            </a>
          </Button>
        ) : (
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock || disabled}
            className={cn(
              "group relative w-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl",
              (isOutOfStock || disabled)
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[var(--color-brand-red)] hover:bg-[var(--color-brand-orange)]",
              "text-white font-bold border-0 h-auto rounded-2xl",
              size === 'sm' ? "min-h-10 px-4 py-2 text-sm" : "min-h-12 px-6 py-3",
              className
            )}
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              {(isOutOfStock || disabled) ? (
                <>
                  <span className="text-lg">❌</span>
                  <span className="font-bold">{isOutOfStock ? "Brak w magazynie" : "Niedostępne"}</span>
                </>
              ) : (
                <>
                  <span className="font-bold">Dodaj do koszyka</span>
                </>
              )}
            </div>
          </Button>
        )
      )}
      
      {/* Quick Configuration Modal */}
      <QuickConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        product={product}
      />
    </div>
  );
};

export default AddToCartButton;

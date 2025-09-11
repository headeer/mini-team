"use client";

import React from "react";
import { Product } from "@/sanity.types";
import ProminentTeethOption from "./ProminentTeethOption";
import BucketConfigurator from "./BucketConfigurator";
import AddToCartButton from "./AddToCartButton";
import FavoriteButton from "./FavoriteButton";
import ProductConfigurator from "./ProductConfigurator";
import { Phone } from "lucide-react";

interface ProductPageClientProps {
  product: Product;
  isPhoneOnly: boolean;
  hasCompat: boolean;
  hasFeatures: boolean;
  hasKeyParams: boolean;
  similar: any[];
  children: React.ReactNode;
}

export default function ProductPageClient({ 
  product, 
  isPhoneOnly, 
  hasCompat, 
  hasFeatures, 
  hasKeyParams, 
  similar, 
  children 
}: ProductPageClientProps) {
  const [addTeeth, setAddTeeth] = React.useState<boolean>(false);

  // Check if product has teeth data
  const hasTeethData = Boolean(
    (product as any)?.toothCost && 
    (product as any)?.toothQty
  );

  return (
    <>
      {children}
      
      {/* Prominent Teeth Option - Show for ALL products with teeth data */}
      {hasTeethData && (
        <div className="mb-6">
          <ProminentTeethOption 
            product={product as any}
            addTeeth={addTeeth}
            onTeethChange={setAddTeeth}
          />
        </div>
      )}

      {/* Configuration Section */}
      {(/łyżk|lyzk/i.test(String((product as any)?.name || ""))) ? (
        <div className="my-4">
          <BucketConfigurator 
            product={{
              ...product as any,
              addTeeth: addTeeth,
              // remove onTeethChange to avoid loops
            }} 
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 my-4">
          <AddToCartButton 
            product={product} 
            extraConfiguration={{
              ...(addTeeth ? { teeth: { enabled: true, price: (product as any)?.toothCost } } : {}),
            }}
          />
          <FavoriteButton showProduct={true} product={product} />
          {isPhoneOnly && (
            <a href="tel:+48782851962" className="ml-auto inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border hover:bg-gray-50">
              <Phone className="h-4 w-4" /> Zamów telefonicznie
            </a>
          )}
        </div>
      )}

      {/* Configurator for mount systems and drill bits */}
      {((product as any)?.mountSystems?.length || (product as any)?.drillBits?.length) ? (
        <ProductConfigurator product={product as any} />
      ) : null}
    </>
  );
}

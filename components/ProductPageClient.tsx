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

      {/* Configuration Section - Show for ALL products */}
      <div className="my-4">
        <BucketConfigurator 
          product={{
            ...(product as any),
            addTeeth: addTeeth,
          }} 
        />
      </div>

      {/* Configurator for mount systems and drill bits (if product defines specific variants) */}
      {((product as any)?.mountSystems?.length || (product as any)?.drillBits?.length) ? (
        <ProductConfigurator product={product as any} />
      ) : null}
    </>
  );
}

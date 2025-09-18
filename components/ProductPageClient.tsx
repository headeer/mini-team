"use client";

import React from "react";
import { Product } from "@/sanity.types";
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

  return (
    <>
      {children}
      

      {/* Configuration Section - Show for ALL products */}
      <div className="my-4">
        <BucketConfigurator 
          product={product as any}
        />
      </div>

      {/* Configurator for mount systems and drill bits (if product defines specific variants) */}
      {((product as any)?.mountSystems?.length || (product as any)?.drillBits?.length) ? (
        <ProductConfigurator product={product as any} />
      ) : null}
    </>
  );
}

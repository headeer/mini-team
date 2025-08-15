"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { client } from "@/sanity/lib/client";
import NoProductAvailable from "./NoProductAvailable";
import { Loader2 } from "lucide-react";
import Container from "./Container";
import { Product } from "@/sanity.types";

interface ProductGridProps { limit?: number }

const ProductGrid = ({ limit = 8 }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const query = `*[_type == "product"] | order(dateUpdated desc)[0...$limit]{
    ...,
    "categories": categories[]->title
  }`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query, { limit });
        setProducts(await response);
      } catch (error) {
        console.log("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [limit, query]);

  return (
    <Container className="flex flex-col lg:px-0 my-16">
      {loading ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 min-h-80 space-y-6 text-center bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200/50 shadow-lg w-full mt-10"
        >
          <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--color-brand-orange)]" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-orange-100 rounded-full animate-ping" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-700">Ładujemy produkty...</h3>
            <p className="text-gray-500">Przygotowujemy najlepsze oferty dla Ciebie</p>
          </div>
          
          {/* Loading skeleton cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 w-full max-w-4xl">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className="aspect-[4/3] bg-gray-100 rounded-xl mb-3 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded mb-2 animate-pulse" />
                <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : products?.length ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Premium Grid Header */}
          <div className="mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--color-brand-orange)]/10 to-[var(--color-brand-red)]/10 px-6 py-3 rounded-full border border-orange-200/50"
            >
              <span className="text-2xl">🔥</span>
              <span className="font-semibold text-gray-700">Nasze najlepsze produkty</span>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            </motion.div>
          </div>

          {/* Enhanced Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 lg:gap-10">
            {products?.map((product, index) => (
              <AnimatePresence key={product?._id}>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.9 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ y: -5 }}
                  className="relative"
                >
                  {/* Floating number badge for featured products */}
                  {index < 3 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (index * 0.1) + 0.5 }}
                      className="absolute -top-3 -left-3 z-30 w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white"
                    >
                      {index + 1}
                    </motion.div>
                  )}
                  
                  <ProductCard product={product} />
                  
                  {/* Subtle glow effect for premium feel */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 to-red-400/5 rounded-3xl -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>

          {/* Bottom CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200/50 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Nie znalazłeś tego czego szukasz?</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Mamy dużo więcej produktów w naszej pełnej ofercie. Sprawdź wszystkie kategorie!
            </p>
            <motion.a
              href="/shop"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)] text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>Zobacz wszystkie produkty</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.a>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <NoProductAvailable />
        </motion.div>
      )}
    </Container>
  );
};

export default ProductGrid;

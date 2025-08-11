"use client";
import { Product } from "@/sanity.types";
import useStore from "@/store";
import { Heart } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const FavoriteButton = ({
  showProduct = false,
  product,
}: {
  showProduct?: boolean;
  product?: Product | null | undefined;
}) => {
  const { favoriteProduct, addToFavorite } = useStore();
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  useEffect(() => {
    const availableItem = favoriteProduct.find(
      (item) => item?._id === product?._id
    );
    setExistingProduct(availableItem || null);
  }, [product, favoriteProduct]);

  const handleFavorite = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (product?._id) {
      addToFavorite(product).then(() => {
        toast.success(
          existingProduct
            ? "Product removed successfully!"
            : "Product added successfully!"
        );
      });
    }
  };
  return (
    <>
      {!showProduct ? (
        <Link href={"/wishlist"} className="group relative">
          <Heart className="w-5 h-5 hover:text-shop_light_green hoverEffect" />
          <span className="absolute -top-1 -right-1 bg-shop_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
            {favoriteProduct?.length ? favoriteProduct?.length : 0}
          </span>
        </Link>
      ) : (
        <button onClick={handleFavorite} aria-label="Dodaj do ulubionych" className="group relative">
          <span className="container inline-block cursor-pointer transition-transform duration-100 group-hover:scale-110">
            <input type="checkbox" checked={Boolean(existingProduct)} readOnly className="absolute opacity-0 h-0 w-0" />
            <span className="checkmark inline-flex items-center justify-center align-middle" aria-hidden>
              <svg viewBox="0 0 256 256" className="h-6 w-6">
                <rect fill="none" height={256} width={256} />
                <path d="M224.6,51.9a59.5,59.5,0,0,0-43-19.9,60.5,60.5,0,0,0-44,17.6L128,59.1l-7.5-7.4C97.2,28.3,59.2,26.3,35.9,47.4a59.9,59.9,0,0,0-2.3,87l83.1,83.1a15.9,15.9,0,0,0,22.6,0l81-81C243.7,113.2,245.6,75.2,224.6,51.9Z" strokeWidth="20px" stroke="#3b9c3c" fill="none" />
              </svg>
            </span>
          </span>
          <style jsx>{`
            .container input:checked ~ .checkmark path { fill: #FF5353; stroke-width: 0; }
            .checkmark { height: 2em; width: 2em; transition: 100ms; animation: dislike_effect 400ms ease; display: inline-block; }
            .container input:checked ~ .checkmark { animation: like_effect 400ms ease; }
            @keyframes like_effect { 0% { transform: scale(0); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
            @keyframes dislike_effect { 0% { transform: scale(0); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
          `}</style>
        </button>
      )}
    </>
  );
};

export default FavoriteButton;

"use client";
import {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
} from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React, { useState } from "react";

type SanityImage = {
  asset?: {
    _ref?: string;
    _type?: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
  };
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
  _type?: "image";
  _key?: string;
};

interface Props {
  images?: Array<SanityImage | string>;
  isStock?: number | undefined;
}

const ImageView = ({ images = [], isStock }: Props) => {
  function toSrc(img?: SanityImage | string | { url?: string } | null): string | null {
    if (!img) return null;
    if (typeof img === "string") return img || null;
    if (typeof img === "object" && "url" in img && img.url) return img.url || null;
    if ((img as SanityImage)?.asset?._ref) {
      try {
        return urlFor(img as SanityImage).url();
      } catch {
        return null;
      }
    }
    return null;
  }

  const firstValid = images.find((i) => Boolean(toSrc(i)));
  const [active, setActive] = useState<SanityImage | string | undefined>(firstValid);

  return (
    <div className="w-full md:w-1/2 space-y-2 md:space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={typeof active === "string" ? active : active?._key || "no-image"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-h-[550px] min-h-[450px] border border-darkColor/10 rounded-md group overflow-hidden"
        >
          {toSrc(active) ? (
            <Image
              src={toSrc(active) as string}
              alt="productImage"
              width={700}
              height={700}
              priority
              className={`w-full h-96 max-h-[550px] min-h-[500px] object-contain group-hover:scale-110 hoverEffect rounded-md ${
                isStock === 0 ? "opacity-50" : ""
              }`}
            />
          ) : (
            <div className="w-full h-96 max-h-[550px] min-h-[500px] bg-gray-100" />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="grid grid-cols-6 gap-2 h-20 md:h-24">
        {images?.map((image, idx) => (
          <button
            key={(typeof image === "string" ? `${idx}-${image}` : image?._key) || `${idx}`}
            onClick={() => setActive(image)}
            className={`border rounded-md overflow-hidden ${
              (typeof active === "string" && typeof image === "string" && active === image) ||
              (typeof active !== "string" && typeof image !== "string" && active?._key && image?._key && active._key === image._key)
                ? "border-darkColor opacity-100"
                : "opacity-80"
            }`}
          >
            {toSrc(image) ? (
              <Image
                src={toSrc(image) as string}
                alt={`Thumbnail ${idx + 1}`}
                width={100}
                height={100}
                loading="eager"
                className="w-full h-auto object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gray-100" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageView;

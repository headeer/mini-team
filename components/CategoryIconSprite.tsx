"use client";

import React from "react";
import Image from "next/image";
// Prefer individual icons from images/categories/ if available; fallback to sprite
import categoriesSprite from "@/images/categories.png";
import lyzki_1_1_5 from "@/images/categories/1-2.3.png";
import lyzki_2_3_3 from "@/images/categories/2.3-3.png";
import lyzki_3_5 from "@/images/categories/3-5.png";
import cat_grabie from "@/images/categories/grabie.png";
import cat_kablow from "@/images/categories/kablow.png";
import cat_niwel from "@/images/categories/niwel.png";
import cat_przesiew from "@/images/categories/przesiew.png";
import cat_ripper from "@/images/categories/ripper.png";
import cat_skandyn from "@/images/categories/skandyn.png";
import cat_szybkozlacza from "@/images/categories/szybkozlacza.png";
import cat_wiertnica from "@/images/categories/wiertnica.png";
const CELL = 256; // px per cell
const COLS = 4; // 4x4 sheet

type Props = {
  title?: string | null;
  className?: string;
};

// 4x4 sprite grid; positions are [col, row] (0-indexed)
// This mapping follows the author's provided sheet
const spriteMap: Record<string, [number, number]> = {
  // Row 0
  "Łyżki kat. 1-1.5 Tony": [0, 0],
  "lyzki-1-1.5t": [0, 0],
  "Łyżki kat. 1.5-2.3 Tony": [1, 0],
  "lyzki-1.5-2.3t": [1, 0],
  "Łyżki kat. 2.3-3 Tony": [2, 0],
  "lyzki-2.3-3t": [2, 0],
  "Łyżki kat. 3-5 Tony": [3, 0],
  "lyzki-3-5t": [3, 0],
  // Row 1
  "Łyżki kablowe": [0, 1],
  "lyzki-kablowe": [0, 1],
  "Łyżki przesiewowe": [1, 1],
  "lyzki-przesiewowe": [1, 1],
  "Łyżki skandynawskie": [2, 1],
  "lyzki-skandynawskie": [2, 1],
  "Grabie": [3, 1],
  "grabie": [3, 1],
  // Row 2
  "Rippery": [0, 2],
  "rippery": [0, 2],
  "Wiertnice": [1, 2],
  "wiertnice": [1, 2],
  "Niwelatory": [2, 2],
  "niwelatory": [2, 2],
  "Szybkozłącza": [3, 2],
  "szybkozlacza": [3, 2],
};

function normalize(input?: string | null): string {
  return String(input || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/ś/g, "s")
    .replace(/ą/g, "a")
    .replace(/ć/g, "c")
    .replace(/ę/g, "e")
    .replace(/ó/g, "o")
    .replace(/ż|ź/g, "z")
    .replace(/\s+/g, "-");
}

export default function CategoryIconSprite({ title, className }: Props) {
  const key = normalize(title);
  // Try dedicated per-category icon files first
  const fileMap: Record<string, any> = {
    "lyzki-1-1.5t": lyzki_1_1_5,
    "lyzki-1.5-2.3t": lyzki_1_1_5,
    "lyzki-2.3-3t": lyzki_2_3_3,
    "lyzki-3-5t": lyzki_3_5,
    "lyzki-kablowe": cat_kablow,
    "lyzki-przesiewowe": cat_przesiew,
    "lyzki-skandynawskie": cat_skandyn,
    "grabie": cat_grabie,
    "rippery": cat_ripper,
    "wiertnice": cat_wiertnica,
    "niwelatory": cat_niwel,
    "szybkozlacza": cat_szybkozlacza,
  };
  const fileKey = ((): string => {
    if (key.includes("1-1.5")) return "lyzki-1-1.5t";
    if (key.includes("1.5-2.3")) return "lyzki-1.5-2.3t";
    if (key.includes("2.3-3")) return "lyzki-2.3-3t";
    if (key.includes("3-5")) return "lyzki-3-5t";
    if (key.includes("kablow")) return "lyzki-kablowe";
    if (key.includes("przesiew")) return "lyzki-przesiewowe";
    if (key.includes("skandyn")) return "lyzki-skandynawskie";
    if (key.includes("grabie")) return "grabie";
    if (key.includes("ripper") || key.includes("zrywak")) return "rippery";
    if (key.includes("wiertnic")) return "wiertnice";
    if (key.includes("niwel")) return "niwelatory";
    if (key.includes("szybkozlacz")) return "szybkozlacza";
    return key;
  })();
  const dedicated = fileMap[fileKey];
  if (dedicated) {
    return (
      <Image src={dedicated} alt="" width={64} height={64} className={className || "object-contain"} />
    );
  }
  // try direct match; also map common variations by content
  let pos: [number, number] | undefined = spriteMap[key];
  if (!pos) {
    if (key.includes("1-1.5")) pos = spriteMap["lyzki-1-1.5t"];
    else if (key.includes("1.5-2.3")) pos = spriteMap["lyzki-1.5-2.3t"];
    else if (key.includes("2.3-3")) pos = spriteMap["lyzki-2.3-3t"];
    else if (key.includes("3-5")) pos = spriteMap["lyzki-3-5t"];
    else if (key.includes("kablow")) pos = spriteMap["lyzki-kablowe"];
    else if (key.includes("przesiew")) pos = spriteMap["lyzki-przesiewowe"];
    else if (key.includes("skandyn")) pos = spriteMap["lyzki-skandynawskie"];
    else if (key.includes("grabie")) pos = spriteMap["grabie"];
    else if (key.includes("ripper") || key.includes("zrywak")) pos = spriteMap["rippery"];
    else if (key.includes("wiertnic")) pos = spriteMap["wiertnice"];
    else if (key.includes("niwel")) pos = spriteMap["niwelatory"];
    else if (key.includes("szybkozlacz")) pos = spriteMap["szybkozlacza"];
  }

  if (!pos) return null;
  const [col, row] = pos;
  // Percentage-based positions work regardless of actual sprite pixel size
  const bgW = 400; // %
  const bgH = 400; // %
  const step = COLS > 1 ? 100 / (COLS - 1) : 0; // 0%, 33.333%, 66.666%, 100%
  const bx = step * col;
  const by = step * row;

  return (
    <div
      aria-hidden
      className={className}
      style={{
        backgroundImage: `url(${(categoriesSprite as any).src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${bgW}% ${bgH}%`,
        backgroundPosition: `${bx}% ${by}%`,
      }}
    />
  );
}



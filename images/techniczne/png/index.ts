// Centralized imports for PDF preview PNGs (generated from PDFs)
// Keys are original PDF filenames; values are imported PNG assets

import grabie_100cm_grubosc_zeba_12mm_1 from "./grabie_100cm_grubosc_zeba_12mm-1.png";
import grabie_100cm_grubosc_zeba_15mm_1 from "./grabie_100cm_grubosc_zeba_15mm-1.png";
import grabie_120cm_12mm_1 from "./grabie_120cm_12mm-1.png";
import grabie_120cm_15mm_1 from "./grabie_120cm_15mm-1.png";
import rysunek_techniczniczny_zrywak_podwojny_2_4_tony_1 from "./rysunek_techniczniczny_zrywak_podwojny_2-4_tony-1.png";
import rysunek_techniczny_premium_1 from "./rysunek_techniczny_premium-1.png";
import rysunek_techniczny_ripper1_1_5tony_1 from "./rysunek_techniczny_ripper1-1.5tony-1.png";
import rysunek_techniczny_wahacz_kostka_1 from "./rysunek_techniczny_wahacz_kostka-1.png";
import rysunek_techniczny_wahacza_gietego_1 from "./rysunek_techniczny_wahacza_gietego-1.png";
import rysunek_techniczny_zrywak_podwojny_4_8_tony_1 from "./rysunek_techniczny_zrywak_podwojny_4-8_tony-1.png";
import rysunek_techniczny_zrywak_pojedynczy_4_8_tony_1 from "./rysunek_techniczny_zrywak_pojedynczy_4-8_tony-1.png";
import rysunek_techniczny_zrywak_pojedynczy2_4tony_1 from "./rysunek_techniczny_zrywak_pojedynczy2-4tony-1.png";

export const pdfPreviewPngMap: Record<string, any> = {
  "grabie_100cm_grubosc_zeba_12mm.pdf": grabie_100cm_grubosc_zeba_12mm_1,
  "grabie_100cm_grubosc_zeba_15mm.pdf": grabie_100cm_grubosc_zeba_15mm_1,
  "grabie_120cm_12mm.pdf": grabie_120cm_12mm_1,
  "grabie_120cm_15mm.pdf": grabie_120cm_15mm_1,
  "rysunek_techniczniczny_zrywak_podwojny_2-4_tony.pdf": rysunek_techniczniczny_zrywak_podwojny_2_4_tony_1,
  "rysunek_techniczny_premium.pdf": rysunek_techniczny_premium_1,
  "rysunek_techniczny_ripper1-1.5tony.pdf": rysunek_techniczny_ripper1_1_5tony_1,
  "rysunek_techniczny_wahacz_kostka.pdf": rysunek_techniczny_wahacz_kostka_1,
  "rysunek_techniczny_wahacza_gietego.pdf": rysunek_techniczny_wahacza_gietego_1,
  "rysunek_techniczny_zrywak_podwojny_4-8_tony.pdf": rysunek_techniczny_zrywak_podwojny_4_8_tony_1,
  "rysunek_techniczny_zrywak_pojedynczy_4-8_tony.pdf": rysunek_techniczny_zrywak_pojedynczy_4_8_tony_1,
  "rysunek_techniczny_zrywak_pojedynczy2-4tony.pdf": rysunek_techniczny_zrywak_pojedynczy2_4tony_1,
};

export function getPreviewByPdfName(name: string) {
  return pdfPreviewPngMap[name];
}



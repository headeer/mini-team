import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Produkt",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Tytuł",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [
        { type: "image", options: { hotspot: true } },
        {
          type: "object",
          name: "externalImage",
          title: "External Image URL",
          fields: [
            { name: "url", title: "URL", type: "url", validation: (Rule) => Rule.required() },
          ],
        },
      ],
    }),
    defineField({
      name: "description",
      title: "Opis",
      type: "text",
    }),
    defineField({
      name: "price",
      title: "Cena (zł)",
      type: "number",
      validation: (Rule) =>
        Rule.custom((value, ctx) => {
          const doc = ctx?.document as any;
          if (doc?.phoneOrderOnly) return true; // price optional when phone orders only
          if (typeof value === "number" && value >= 0) return true;
          return "Cena jest wymagana (chyba, że zaznaczysz 'Zamówienia telefoniczne').";
        }),
    }),
    // Dodatkowe pola cenowe dla MiniTeam
    defineField({ name: "basePrice", title: "Cena bazowa (zł)", type: "number" }),
    defineField({ name: "priceOlx", title: "Cena OLX", type: "string" }),
    defineField({ name: "priceText", title: "Cena (tekst)", type: "string" }),
    defineField({ name: "toothCost", title: "Koszt zębów (zł)", type: "number" }),
    defineField({ name: "toothQty", title: "Ilość zębów (szt)", type: "number" }),
    defineField({
      name: "priceTier",
      title: "Zakres maszyn",
      type: "string",
      options: {
        list: [
          { title: "1–1.5T", value: "1-1.5t" },
          { title: "1.5–2.3T", value: "1.5-2.3t" },
          { title: "2.3–3T", value: "2.3-3t" },
          { title: "3–5T", value: "3-5t" },
        ],
      },
    }),
    defineField({
      name: "discount",
      title: "Rabat (%)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "ripperTier",
      title: "Zakres maszyn (zrywak)",
      type: "string",
      description: "Używane dla zrywaków korzeni. Np. 1-1.5t, 2-4t, 4-8t.",
      options: {
        list: [
          { title: "1–1.5T", value: "1-1.5t" },
          { title: "2–4T", value: "2-4t" },
          { title: "4–8T", value: "4-8t" },
        ],
      },
    }),
    defineField({
      name: "categories",
      title: "Kategorie",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    // Hidden subcategory to support technical drawings grouping
    defineField({
      name: "subcategory",
      title: "Podkategoria (ukryta)",
      type: "string",
      description: "Używane tylko do rysunków technicznych i wewnętrznego grupowania (np. łyżki kopiące / skarpowe; grabie wariant)",
      options: {
        list: [
          { title: "Łyżki kopiące", value: "lyzki-kopiace" },
          { title: "Łyżki skarpowe", value: "lyzki-skarpowe" },
          { title: "Grabie 100cm/12mm", value: "grabie-100-12" },
          { title: "Grabie 100cm/15mm", value: "grabie-100-15" },
          { title: "Grabie 120cm/12mm", value: "grabie-120-12" },
          { title: "Grabie 120cm/15mm", value: "grabie-120-15" },
        ],
      },
    }),
    // Weight range for top-level bucket grouping (visible categories)
    defineField({
      name: "weightRange",
      title: "Zakres wagowy (T)",
      type: "string",
      description: "Służy do mapowania na kategorie: 1–2t, 2–3t, 3–4.5t",
      options: {
        list: [
          { title: "1–2t", value: "1-2t" },
          { title: "2–3t", value: "2-3t" },
          { title: "3–4.5t", value: "3-4.5t" },
        ],
      },
    }),
    defineField({
      name: "stock",
      title: "Stan magazynowy",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "brand",
      title: "Marka",
      type: "reference",
      to: { type: "brand" },
    }),

    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Nowy", value: "new" },
          { title: "Popularny", value: "hot" },
          { title: "Promocja", value: "sale" },
        ],
      },
    }),
    // Specyfikacje
    defineField({
      name: "specifications",
      title: "Specyfikacje",
      type: "object",
      fields: [
        defineField({ name: "widthCm", title: "Szerokość (cm)", type: "number" }),
        defineField({ name: "pinDiameterMm", title: "Średnica sworznia (mm)", type: "number" }),
        defineField({ name: "volumeM3", title: "Pojemność (m³)", type: "number" }),
        defineField({ name: "cuttingEdge", title: "Lemiesz (opis)", type: "string" }),
        defineField({ name: "toothThickness", title: "Grubość zęba (mm)", type: "number" }),
        defineField({ name: "toothCount", title: "Liczba zębów (szt)", type: "number" }),
        defineField({ name: "features", title: "Cechy", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "machineCompatibility", title: "Kompatybilność maszyn", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "quickCoupler", title: "Szybkozłącze", type: "string" }),
        defineField({ name: "kinetyka", title: "Kinetyka (°)", type: "number" }),
        defineField({ name: "ramie", title: "Ramię (mm)", type: "number" }),
      ],
    }),
    defineField({ name: "dateUpdated", title: "Data aktualizacji", type: "datetime" }),
    defineField({
      name: "phoneOrderOnly",
      title: "Zamówienia telefoniczne",
      type: "boolean",
      description: "Jeśli włączone, cena nie jest wymagana – kupno tylko telefonicznie.",
      initialValue: false,
    }),
    defineField({ name: "externalId", title: "Zewnętrzne ID", type: "string" }),
    defineField({ name: "location", title: "Lokalizacja", type: "string" }),
    defineField({ name: "viewsCount", title: "Liczba wyświetleń", type: "number", initialValue: 0 }),
    defineField({ name: "featuredRank", title: "Ranking polecanych", type: "number" }),
    defineField({
      name: "isFeatured",
      title: "Produkt wyróżniony",
      type: "boolean",
      description: "Włącz/wyłącz wyróżnienie",
      initialValue: false,
    }),
    
    // Technical Drawing
    defineField({
      name: "technicalDrawing",
      title: "Rysunek techniczny",
      type: "object",
      fields: [
        defineField({ name: "url", title: "URL pliku PDF", type: "string" }),
        defineField({ name: "title", title: "Tytuł", type: "string" }),
        defineField({ name: "type", title: "Typ pliku", type: "string", initialValue: "pdf" }),
      ],
    }),
    
    // Similar Products - Manual Override
    defineField({
      name: "similarProducts",
      title: "Podobne produkty (ręczne)",
      type: "array",
      description: "Jeśli wybierzesz produkty tutaj, będą one pokazane zamiast automatycznych rekomendacji AI",
      of: [{ 
        type: "reference", 
        to: { type: "product" },
        options: {
          filter: ({ document }) => ({
            filter: "_id != $id",
            params: { id: document._id }
          })
        }
      }],
      validation: (Rule) => Rule.max(6).warning("Maksymalnie 6 produktów dla najlepszego wyglądu"),
    }),
    
    // AI Recommendations Settings
    defineField({
      name: "recommendationSettings",
      title: "Ustawienia rekomendacji AI",
      type: "object",
      description: "Kontroluj jak AI wybiera podobne produkty",
      fields: [
        defineField({
          name: "enableAutoRecommendations",
          title: "Włącz automatyczne rekomendacje",
          type: "boolean",
          description: "Jeśli wyłączone, będą pokazane tylko ręcznie wybrane produkty",
          initialValue: true,
        }),
        defineField({
          name: "priorityFactors",
          title: "Priorytet czynników",
          type: "object",
          fields: [
            defineField({ name: "categoryWeight", title: "Waga kategorii (%)", type: "number", initialValue: 40 }),
            defineField({ name: "typeWeight", title: "Waga typu produktu (%)", type: "number", initialValue: 30 }),
            defineField({ name: "priceWeight", title: "Waga ceny (%)", type: "number", initialValue: 15 }),
            defineField({ name: "specWeight", title: "Waga specyfikacji (%)", type: "number", initialValue: 15 }),
          ],
        }),
        defineField({
          name: "excludeFromRecommendations",
          title: "Wyklucz z rekomendacji",
          type: "boolean",
          description: "Ten produkt nie będzie pokazywany jako podobny do innych",
          initialValue: false,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "images",
      subtitle: "price",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      const image = media && media[0];
      return {
        title: title,
        subtitle: `${subtitle} PLN`,
        media: image,
      };
    },
  },
});

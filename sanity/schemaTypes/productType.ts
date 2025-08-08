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
      of: [{ type: "image", options: { hotspot: true } }],
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
      validation: (Rule) => Rule.required().min(0),
    }),
    // Dodatkowe pola cenowe dla MiniTeam
    defineField({ name: "basePrice", title: "Cena bazowa (zł)", type: "number" }),
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
      name: "categories",
      title: "Kategorie",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
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
        defineField({ name: "features", title: "Cechy", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "machineCompatibility", title: "Kompatybilność maszyn", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "quickCoupler", title: "Szybkozłącze", type: "string" }),
      ],
    }),
    defineField({ name: "dateUpdated", title: "Data aktualizacji", type: "datetime" }),
    defineField({ name: "externalId", title: "Zewnętrzne ID", type: "string" }),
    defineField({
      name: "isFeatured",
      title: "Produkt wyróżniony",
      type: "boolean",
      description: "Włącz/wyłącz wyróżnienie",
      initialValue: false,
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

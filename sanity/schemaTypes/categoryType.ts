import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export const categoryType = defineType({
  name: "category",
  title: "Kategoria",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tytuł",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Opis",
      type: "text",
    }),
    defineField({
      name: "range",
      title: "Zakres",
      type: "number",
      description: "Od",
    }),
    defineField({
      name: "featured",
      title: "Wyróżniona",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "image",
      title: "Obraz kategorii",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "visible",
      title: "Widoczna dla użytkowników",
      type: "boolean",
      description: "Jeśli wyłączone, kategoria nie będzie wyświetlana w sklepie (użyteczne dla podkategorii technicznych)",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "image",
    },
  },
});

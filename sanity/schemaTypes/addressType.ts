import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const addressType = defineType({
  name: "address",
  title: "Addresses",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "name",
      title: "Address Name",
      type: "string",
      description: "A friendly name for this address (e.g. Home, Work)",
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "email",
      title: "User Email",
      type: "email",
    }),
    defineField({
      name: "address",
      title: "Street Address",
      type: "string",
      description: "The street address including apartment/unit number",
      validation: (Rule) => Rule.required().min(5).max(100),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "state",
      title: "Województwo",
      type: "string",
      description: "Nazwa województwa (e.g. Dolnośląskie, Mazowieckie)",
      options: {
        list: [
          { title: "Dolnośląskie", value: "dolnośląskie" },
          { title: "Kujawsko-pomorskie", value: "kujawsko-pomorskie" },
          { title: "Lubelskie", value: "lubelskie" },
          { title: "Lubuskie", value: "lubuskie" },
          { title: "Łódzkie", value: "łódzkie" },
          { title: "Małopolskie", value: "małopolskie" },
          { title: "Mazowieckie", value: "mazowieckie" },
          { title: "Opolskie", value: "opolskie" },
          { title: "Podkarpackie", value: "podkarpackie" },
          { title: "Podlaskie", value: "podlaskie" },
          { title: "Pomorskie", value: "pomorskie" },
          { title: "Śląskie", value: "śląskie" },
          { title: "Świętokrzyskie", value: "świętokrzyskie" },
          { title: "Warmińsko-mazurskie", value: "warmińsko-mazurskie" },
          { title: "Wielkopolskie", value: "wielkopolskie" },
          { title: "Zachodniopomorskie", value: "zachodniopomorskie" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "zip",
      title: "Kod pocztowy",
      type: "string",
      description: "Format: 12-345 (np. 56-100)",
      validation: (Rule) =>
        Rule.required()
          .regex(/^\d{2}-\d{3}$/, {
            name: "postalCode",
            invert: false,
          })
          .custom((zip: string | undefined) => {
            if (!zip) {
              return "Kod pocztowy jest wymagany";
            }
            if (!zip.match(/^\d{2}-\d{3}$/)) {
              return "Proszę wpisać poprawny kod pocztowy w formacie 12-345 (np. 56-100)";
            }
            return true;
          }),
    }),
    defineField({
      name: "default",
      title: "Default Address",
      type: "boolean",
      description: "Is this the default shipping address?",
      initialValue: false,
    }),

    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "address",
      city: "city",
      state: "state",
      isDefault: "default",
    },
    prepare({ title, subtitle, city, state, isDefault }) {
      return {
        title: `${title} ${isDefault ? "(Default)" : ""}`,
        subtitle: `${subtitle}, ${city}, ${state}`,
      };
    },
  },
});

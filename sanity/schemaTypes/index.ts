import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./categoryType";
import { blockContentType } from "./blockContentType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { brandType } from "./brandTypes";
import { blogType } from "./blogType";
import { blogCategoryType } from "./blogCategoryType";
import { authorType } from "./authorType";
import { addressType } from "./addressType";
import { defineType } from "sanity";
import { fitCheckType } from "./fitCheckType";
import { defineField } from "sanity";

// New custom schemas aligned with MiniTeamProject
const companyType = defineType({
  name: "company",
  title: "Firma",
  type: "document",
  fields: [
    { name: "name", title: "Nazwa firmy", type: "string" },
    { name: "nip", title: "NIP", type: "string" },
    { name: "address", title: "Adres", type: "string" },
    { name: "phone", title: "Telefon", type: "string" },
    { name: "email", title: "Email", type: "string" },
    { name: "website", title: "Strona WWW", type: "url" },
  ],
});

const customerType = defineType({
  name: "customer",
  title: "Klient",
  type: "document",
  fields: [
    { name: "clerkUserId", title: "Clerk User ID", type: "string" },
    { name: "name", title: "Imię i nazwisko", type: "string" },
    { name: "email", title: "Email", type: "string" },
    { name: "phone", title: "Telefon", type: "string" },
    { name: "address", title: "Adres", type: "string" },
  ],
});

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    categoryType,
    blockContentType,
    productType,
    orderType,
    brandType,
    blogType,
    blogCategoryType,
    authorType,
    addressType,
    companyType,
    customerType,
    fitCheckType,
    defineType({
      name: "serviceInquiry",
      title: "Zapytanie – Obróbka",
      type: "document",
      fields: [
        defineField({ name: "service", title: "Usługa", type: "string", options: { list: [
          { title: "Cięcie laserem", value: "laser" },
          { title: "Gięcie blach", value: "giecie" },
          { title: "Frezowanie CNC", value: "frezowanie" },
          { title: "Toczenie", value: "toczenie" },
        ]}}),
        defineField({ name: "name", title: "Imię i firma", type: "string" }),
        defineField({ name: "phone", title: "Telefon", type: "string" }),
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({ name: "city", title: "Miasto", type: "string" }),
        defineField({ name: "material", title: "Materiał", type: "string" }),
        defineField({ name: "thickness", title: "Grubość (mm)", type: "number" }),
        defineField({ name: "quantity", title: "Ilość (szt)", type: "number" }),
        // Service-specific details
        defineField({ name: "bendLength", title: "Długość gięcia (mm)", type: "number" }),
        defineField({ name: "operations", title: "Operacje (frez/tok/gwint)", type: "string" }),
        defineField({ name: "deadline", title: "Termin", type: "string" }),
        defineField({ name: "message", title: "Opis zlecenia", type: "text" }),
        defineField({ name: "createdAt", title: "Data", type: "datetime", initialValue: () => new Date().toISOString() }),
      ]
    })
  ],
};

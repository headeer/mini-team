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
  ],
};

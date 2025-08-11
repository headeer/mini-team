import { defineField, defineType } from "sanity";
import { WrenchIcon } from "@sanity/icons";

export const fitCheckType = defineType({
  name: "fitCheck",
  title: "Fit Check",
  type: "document",
  icon: WrenchIcon,
  fields: [
    defineField({ name: "name", title: "Imię i nazwisko", type: "string", validation: (R) => R.required() }),
    defineField({ name: "phone", title: "Telefon", type: "string", validation: (R) => R.required() }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "machineBrand", title: "Marka maszyny", type: "string" }),
    defineField({ name: "machineModel", title: "Model maszyny", type: "string" }),
    defineField({ name: "attachmentType", title: "Rodzaj osprzętu", type: "string" }),
    defineField({ name: "message", title: "Wiadomość", type: "text" }),
    defineField({ name: "images", title: "Zdjęcia", type: "array", of: [{ type: "image" }] }),
    defineField({ name: "status", title: "Status", type: "string", initialValue: "new", options: { list: ["new", "in_review", "done"] } }),
    defineField({ name: "createdAt", title: "Utworzono", type: "datetime", initialValue: () => new Date().toISOString() }),
  ],
});




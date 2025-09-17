import { notFound } from "next/navigation";

export const metadata = {
  title: "Realizacje (niedostępne)",
  description: "Ta podstrona jest obecnie wyłączona.",
  robots: { index: false, follow: false },
};

export default function RealizacjePage() {
  notFound();
  return null;
}


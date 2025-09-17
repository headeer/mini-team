import React from "react";
import { client } from "@/sanity/lib/client";

const BrandPage = () => {
  return <div>BrandPage</div>;
};

export default BrandPage;

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(
    `*[_type == "brand" && defined(slug.current)].slug.current`
  );
  return (slugs || []).map((slug) => ({ slug }));
}

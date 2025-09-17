// no-op
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  redirect(`/shop?category=${encodeURIComponent(slug)}`);
};

export default CategoryPage;

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(
    `*[_type == "category" && defined(slug.current)].slug.current`
  );
  return (slugs || []).map((slug) => ({ slug }));
}

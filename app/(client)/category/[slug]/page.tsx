// no-op
import { redirect } from "next/navigation";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  redirect(`/shop?category=${encodeURIComponent(slug)}`);
};

export default CategoryPage;

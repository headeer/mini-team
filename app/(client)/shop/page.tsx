import Shop from "@/components/Shop";
import { getCategories } from "@/sanity/queries";
import React, { Suspense } from "react";
import Container from "@/components/Container";

const ShopPage = async () => {
  const categories = await getCategories();
  return (
    <div className="bg-white">
      <Container>
        <Suspense fallback={<div>Loading...</div>}>
          <Shop categories={categories} brands={[]} />
        </Suspense>
      </Container>
    </div>
  );
};

export default ShopPage;

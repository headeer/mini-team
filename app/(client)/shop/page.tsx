import Shop from "@/components/Shop";
import { getCategories } from "@/sanity/queries";
import React from "react";
import Container from "@/components/Container";

const ShopPage = async () => {
  const categories = await getCategories();
  return (
    <div className="bg-white">
      <Container>
        <Shop categories={categories} brands={[]} />
      </Container>
    </div>
  );
};

export default ShopPage;

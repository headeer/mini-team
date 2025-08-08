import Container from "@/components/Container";
import TopBenefitsBar from "@/components/TopBenefitsBar";
import HomeHero from "@/components/home/HomeHero";
import WhyHardox from "@/components/home/WhyHardox";
import HomeCategories from "@/components/HomeCategories";
import LatestBlog from "@/components/LatestBlog";
import ProductGrid from "@/components/ProductGrid";
import ShopByBrands from "@/components/ShopByBrands";
import { getCategories } from "@/sanity/queries";

import React from "react";

const Home = async () => {
  const categories = await getCategories(6);

  return (
    <div className="bg-white">
      <TopBenefitsBar />
      <Container>
        <HomeHero />
        <ProductGrid />
        <HomeCategories categories={categories} />
        <WhyHardox />
        <ShopByBrands />
        <LatestBlog />
      </Container>
    </div>
  );
};

export default Home;

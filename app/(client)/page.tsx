import Container from "@/components/Container";
import AppSection from "@/components/ui/AppSection";
import AppHeading from "@/components/ui/AppHeading";
import HomeHero from "@/components/home/HomeHero";
import Head from "next/head";
import WhyHardox from "@/components/home/WhyHardox";
import HomeCategories from "@/components/HomeCategories";
import LatestBlog from "@/components/LatestBlog";
import { getCategories } from "@/sanity/queries";
import SevenReasons from "@/components/home/SevenReasons";
import RealizacjeCarousel from "@/components/home/RealizacjeCarousel";
import FAQ from "@/components/home/FAQ";
import FinalCTA from "@/components/home/FinalCTA";
import HomeShowcase from "@/components/home/HomeShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BestSellers from "@/components/home/BestSellers";
import ProjectsInAction from "@/components/home/ProjectsInAction";
import BrandStory from "@/components/home/BrandStory";

import React from "react";

const Home = async () => {
  const categories = await getCategories(6);

  return (
    <div className="bg-white">
      <Head>
        <title>Łyżki Hardox HB500 – Polska produkcja | Dostawa 48 h</title>
        <meta name="description" content="Polskie łyżki Hardox HB500 – 3× dłuższa żywotność. Kompatybilne mocowania, 2 lata gwarancji, dostawa 48 h." />
      </Head>
      <HomeHero />
      <Container>
        <AppSection>
          <div id="products" className="mt-4 scroll-mt-28 sm:scroll-mt-32">
            {/* Use curated featured block with local images for strong visual consistency */}
            {/* @ts-expect-error Async Server Component */}
            <FeaturedProducts />
          </div>
        </AppSection>
        <HomeCategories categories={categories} />
        <HomeShowcase />
        <AppSection>
          <WhyHardox />
        </AppSection>
        <AppSection>
          <SevenReasons />
        </AppSection>
        <AppSection>
          <BrandStory />
        </AppSection>
        <AppSection>
          <ProjectsInAction />
        </AppSection>
        {/* @ts-expect-error Async Server Component */}
        <BestSellers />
        <AppSection>
          <AppHeading eyebrow="Realizacje" title="Nasze realizacje" subtitle="Prawdziwe wdrożenia, realne efekty – sprawdź jak pracuje nasz osprzęt" />
          <RealizacjeCarousel />
        </AppSection>
        <AppSection>
          <FAQ />
        </AppSection>
        <FinalCTA />
        <LatestBlog />
        {/* Fit Check is mounted globally in layout */}
      </Container>
    </div>
  );
};

export default Home;

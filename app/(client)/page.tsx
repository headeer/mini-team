import Container from "@/components/Container";
import AppSection from "@/components/ui/AppSection";
import AppHeading from "@/components/ui/AppHeading";
import HomeHero from "@/components/home/HomeHero";
import Head from "next/head";
import WhyHardox from "@/components/home/WhyHardox";
import LatestBlog from "@/components/LatestBlog";
import SevenReasons from "@/components/home/SevenReasons";
// import RealizacjeCarousel from "@/components/home/RealizacjeCarousel";
import FAQ from "@/components/home/FAQ";
import FinalCTA from "@/components/home/FinalCTA";
import HomeShowcase from "@/components/home/HomeShowcase";
import AllCategories from "@/components/home/AllCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BestSellers from "@/components/home/BestSellers";
import ProjectsInAction from "@/components/home/ProjectsInAction";
import BrandStory from "@/components/home/BrandStory";

import React from "react";

const Home = async () => {
  

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
            <FeaturedProducts />
          </div>
        </AppSection>
        {/* Removed "Polecane kategorie"; using AllCategories below for mobile/desktop */}
        <HomeShowcase />
        <AppSection>
          <WhyHardox />
        </AppSection>
        {/* Wszystkie kategorie – przeniesione przed sekcję "Dlaczego Hardox" (widoczne na wszystkich rozdzielczościach) */}
        <AllCategories />
        <AppSection>
          <SevenReasons />
        </AppSection>
        <AppSection>
          <BrandStory />
        </AppSection>
        <AppSection>
        <AppHeading eyebrow="Realizacje" title="Nasze realizacje" subtitle="Prawdziwe wdrożenia, realne efekty – sprawdź jak pracuje nasz osprzęt" />

          <ProjectsInAction />
        </AppSection>
        <BestSellers />
        {/* AllCategories przeniesione wyżej */}
        
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

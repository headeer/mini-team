import React from "react";
import { Title } from "./ui/text";
import Link from "next/link";
import Image from "next/image";
import heroImg from "@/images/main/close-up-of-excavator-at-construction-site-backho-2025-01-29-04-41-18-utc.webp";

const HomeBanner = () => {
  return (
    <div className="py-16 md:py-0 bg-shop_light_pink rounded-lg px-10 lg:px-24 flex items-center justify-between overflow-hidden">
      <div className="space-y-5">
        <Title>
          Osprzęt do maszyn budowlanych i rolniczych
          <br />
          Produkcja na zamówienie
        </Title>
        <Link
          href={"/shop"}
          className="bg-[var(--color-brand-orange)] text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-[var(--color-brand-red)] hoverEffect"
        >
          Zobacz ofertę
        </Link>
      </div>
      <div className="hidden md:block">
        <Image
          src={heroImg}
          alt="Sprzęt budowlany"
          className="w-96 object-cover rounded-lg"
        />
      </div>
    </div>
  );
};

export default HomeBanner;

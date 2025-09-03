import React from "react";
import Container from "./Container";
import FooterTop from "./FooterTop";
import Logo from "./Logo";
import { SubText, SubTitle } from "./ui/text";
import { categoriesData } from "@/constants/data";
import Link from "next/link";
//

const Footer = () => {
  const topCategories = categoriesData?.slice(0, 8) || [];
  return (
    <footer className="bg-white border-t overflow-x-hidden">
      <Container>
        <FooterTop />
        <div className="py-8 sm:py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2">
              <Logo />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Łyżki i osprzęt Hardox HB500 do koparek – polska produkcja, dostawa 48 h, gwarancja 2 lata.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 tracking-wide uppercase text-xs">Linki</h4>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li><Link href="/kontakt" className="hover:text-shop_light_green hoverEffect">Kontakt</Link></li>
              <li><Link href="/regulamin" className="hover:text-shop_light_green hoverEffect">Regulamin</Link></li>
              <li><Link href="/polityka-prywatnosci" className="hover:text-shop_light_green hoverEffect">Polityka prywatności</Link></li>
              <li><Link href="/faq" className="hover:text-shop_light_green hoverEffect">FAQ</Link></li>
              <li><Link href="/pomoc" className="hover:text-shop_light_green hoverEffect">Pomoc</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 tracking-wide uppercase text-xs">Kategorie</h4>
            <ul className="mt-3 space-y-2.5 text-sm">
              {topCategories.map((item) => (
                <li key={item?.title}>
                  <Link href={`/category/${item?.href}`} className="hover:text-shop_light_green hoverEffect">
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 tracking-wide uppercase text-xs">Dane firmy</h4>
            <p className="text-gray-600 text-sm">
              MiniTeamProject Teodorczyk Piotr<br/>Ujazd 11, 56-330 Ujazd, Dolnośląskie<br/>NIP: 9161401364
            </p>
            <p className="text-gray-600 text-sm">
              E-mail: <a href="mailto:teodorczykpt@gmail.com" className="hover:underline">teodorczykpt@gmail.com</a><br/>Tel.: <a href="tel:+48782851962" className="hover:underline">782-851-962</a>
            </p>
          </div>
        </div>
        <div className="py-5 border-t text-center text-sm text-gray-600">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 text-xs text-gray-500 border border-gray-200 rounded-lg px-2 py-1">
              <span>© {new Date().getFullYear()} MiniTeamProject</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="inline-flex items-center gap-2">
              <span>Projekt i wdrożenie</span>
              <span className="font-semibold">MiniTeamProject</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;



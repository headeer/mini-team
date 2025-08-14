import React from "react";
import Container from "./Container";
import FooterTop from "./FooterTop";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import { SubText, SubTitle } from "./ui/text";
import { categoriesData } from "@/constants/data";
import Link from "next/link";
//

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <Container>
        <FooterTop />
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <SubText>
              Łyżki i osprzęt Hardox HB500 do koparek – polska produkcja, dostawa 48 h, gwarancja 2 lata.
            </SubText>
            <SocialMedia
              className="text-darkColor/60"
              iconClassName="border-darkColor/60 hover:border-shop_light_green hover:text-shop_light_green"
              tooltipClassName="bg-darkColor text-white"
            />
          </div>
          <div>
            <SubTitle>Linki</SubTitle>
            <ul className="space-y-3 mt-4">
              <li><Link href="/kontakt" className="hover:text-shop_light_green hoverEffect font-medium">Kontakt</Link></li>
              <li><Link href="/regulamin" className="hover:text-shop_light_green hoverEffect font-medium">Regulamin</Link></li>
              <li><Link href="/polityka-prywatnosci" className="hover:text-shop_light_green hoverEffect font-medium">Polityka prywatności</Link></li>
              <li><Link href="/faq" className="hover:text-shop_light_green hoverEffect font-medium">FAQ</Link></li>
              <li><Link href="/pomoc" className="hover:text-shop_light_green hoverEffect font-medium">Pomoc</Link></li>
            </ul>
          </div>
          <div>
            <SubTitle>Kategorie</SubTitle>
            <ul className="space-y-3 mt-4">
              {categoriesData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={`/category/${item?.href}`}
                    className="hover:text-shop_light_green hoverEffect font-medium"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <SubTitle>Dane firmy</SubTitle>
            <SubText>
              MiniTeamProject Teodorczyk Piotr<br/>Ujazd 11, 56-330 Ujazd, Dolnośląskie<br/>NIP: 9161401364
            </SubText>
            <SubText>
              E-mail: <a href="mailto:teodorczykpt@gmail.com" className="hover:underline">teodorczykpt@gmail.com</a><br/>Tel.: <a href="tel:+48782851962" className="hover:underline">782-851-962</a>
            </SubText>
          </div>
        </div>
        <div className="py-6 border-t text-center text-sm text-gray-600">
          <div>
            © {new Date().getFullYear()} <Logo className="text-sm" />. Wszelkie prawa zastrzeżone.
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

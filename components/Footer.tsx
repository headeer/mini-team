import React from "react";
import Container from "./Container";
import FooterTop from "./FooterTop";
import Logo from "./Logo";
import CookieSettingsLink from "./CookieSettingsLink";
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
              <li><CookieSettingsLink /></li>
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
              <a
                href="https://uido.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 group"
                aria-label="uido.pl"
                title="uido.pl"
              >
                <span className="logo inline-flex items-center">
                  <span className="logo-text inline-flex">
                  <svg xmlns="http://www.w3.org/2000/svg" width="75" height="21" viewBox="0 0 75 21" fill="none">
<path d="M13.6641 11.5903C13.6641 12.4299 13.508 13.1595 13.1945 13.7762C12.881 14.3943 12.4129 14.8668 11.7858 15.1967C11.1602 15.5266 10.3772 15.6901 9.43953 15.6901C8.50191 15.6901 7.73813 15.5251 7.10512 15.1967C6.47063 14.8668 5.99364 14.3943 5.67268 13.7762C5.35172 13.158 5.19124 12.4299 5.19124 11.5903V1.33887H0.078125V11.837C0.078125 13.534 0.468928 15.011 1.25202 16.2711C2.03362 17.5311 3.12876 18.5104 4.53742 19.2102C5.94609 19.9101 7.57914 20.2608 9.44102 20.2608C11.3029 20.2608 12.9567 19.9101 14.3565 19.2102C15.7563 18.5104 16.8469 17.5311 17.63 16.2711C18.4116 15.011 18.8039 13.534 18.8039 11.837V1.33887H13.6655V11.5903H13.6641Z" fill="#111E19"/>
<path d="M27.1248 1.33887H22.0117V19.8655H27.1248V1.33887Z" fill="#111E19"/>
<path d="M45.5905 2.4875C43.9351 1.72224 42.0123 1.33887 39.8221 1.33887H30.584V19.8655H39.8221C42.0123 19.8655 43.9351 19.4822 45.5905 18.7169C47.2458 17.9516 48.5297 16.8729 49.4435 15.4805C50.3574 14.0897 50.815 12.4626 50.815 10.6022C50.815 8.74181 50.3574 7.11471 49.4435 5.72387C48.5297 4.33303 47.2443 3.25424 45.5905 2.4875ZM44.9857 13.0971C44.5414 13.8059 43.9114 14.3527 43.0956 14.739C42.2798 15.1254 41.3214 15.3201 40.2173 15.3201H35.6718V5.88435H40.2173C41.3199 5.88435 42.2798 6.07752 43.0956 6.46535C43.9099 6.8517 44.5399 7.39555 44.9857 8.09542C45.43 8.7953 45.6529 9.63188 45.6529 10.6022C45.6529 11.5725 45.43 12.3898 44.9857 13.0971Z" fill="#111E19"/>
<path d="M73.2699 5.53812C72.3471 4.08933 71.0632 2.96151 69.4168 2.15464C67.7704 1.34778 65.8431 0.943604 63.6365 0.943604C61.4299 0.943604 59.5234 1.34778 57.8681 2.15464C56.2128 2.96151 54.9289 4.08933 54.0151 5.53812C53.1012 6.98691 52.6436 8.67494 52.6436 10.6022C52.6436 12.5295 53.1012 14.2175 54.0151 15.6663C54.9289 17.1151 56.2143 18.2444 57.8681 19.0498C59.5234 19.8566 61.4463 20.2608 63.6365 20.2608C65.8268 20.2608 67.7704 19.8581 69.4168 19.0498C71.0632 18.2429 72.3486 17.1151 73.2699 15.6663C74.1926 14.2175 74.6533 12.5295 74.6533 10.6022C74.6533 8.67494 74.1926 6.98691 73.2699 5.53812ZM68.7615 13.32C68.292 14.0778 67.6203 14.6618 66.7481 15.0734C65.8743 15.485 64.8372 15.6915 63.635 15.6915C62.4329 15.6915 61.4195 15.4865 60.5473 15.0734C59.6735 14.6618 58.9989 14.0778 58.5219 13.32C58.0435 12.5621 57.8057 11.6572 57.8057 10.6022C57.8057 9.54718 58.0449 8.64224 58.5219 7.88442C58.9989 7.12659 59.675 6.54262 60.5473 6.13101C61.4195 5.71941 62.4493 5.51286 63.635 5.51286C64.8208 5.51286 65.8743 5.71941 66.7481 6.13101C67.6203 6.54262 68.292 7.12807 68.7615 7.88442C69.2311 8.64224 69.4659 9.54718 69.4659 10.6022C69.4659 11.6572 69.2311 12.5621 68.7615 13.32Z" fill="#111E19"/>
</svg>
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;



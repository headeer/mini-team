import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import MobileMenu from "./MobileMenu";
import HeaderHelpersMenu from "./HeaderHelpersMenu";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Logs } from "lucide-react";
import { getMyOrders } from "@/sanity/queries";
import HeaderAuth from "./HeaderAuth";

const Header = async () => {
  const user = await currentUser();
  const userId = user?.id ?? null;
  let orders: any[] | null = null;
  if (userId) {
    try {
      orders = await getMyOrders(userId);
    } catch (_) {
      orders = null;
    }
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <Container className="flex items-center justify-between h-14 md:h-16">
        {/* Logo + Mobile */}
        <div className="flex items-center gap-3">
          <MobileMenu user={user} />
          <Logo />
        </div>

        {/* Navigation (inspired by MiniTeam MegaMenu) */}
        <div className="hidden lg:flex items-center gap-2">
          <HeaderMenu user={user} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="hidden xs:flex">
            <SearchBar />
          </div>
          <CartIcon />
          <div className="hidden sm:block">
            <FavoriteButton />
          </div>
          <HeaderHelpersMenu />
          {user && (
            <Link href={"/orders"} className="group relative text-gray-700 hover:text-orange-500 hidden sm:inline-flex">
              <Logs className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-shop_btn_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                {orders?.length ? orders?.length : 0}
              </span>
            </Link>
          )}
          <HeaderAuth />
        </div>
      </Container>
    </header>
  );
};

export default Header;

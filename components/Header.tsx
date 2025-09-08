import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import SignIn from "./SignIn";
import MobileMenu from "./MobileMenu";
// import { currentUser } from "@clerk/nextjs/server";
// import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Logs } from "lucide-react";
import { getMyOrders } from "@/sanity/queries";
import HeaderHelpersMenu from "./HeaderHelpersMenu";

const Header = async () => {
  // Temporarily disable Clerk authentication
  const user = null;
  const userId = null;
  let orders = null;
  // if (userId) {
  //   orders = await getMyOrders(userId);
  // }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <Container className="flex items-center justify-between h-14 md:h-16">
        {/* Logo + Mobile */}
        <div className="flex items-center gap-3">
          <MobileMenu />
          <Logo />
        </div>

        {/* Navigation (inspired by MiniTeam MegaMenu) */}
        <div className="hidden lg:flex items-center gap-2">
          <HeaderMenu />
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
          {/* Temporarily disabled Clerk authentication */}
          {/* {user && (
            <Link href={"/orders"} className="group relative text-gray-700 hover:text-orange-500 hidden sm:inline-flex">
              <Logs className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-shop_btn_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                {orders?.length ? orders?.length : 0}
              </span>
            </Link>
          )}
          <ClerkLoaded>
            <SignedIn>
              <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
            </SignedIn>
            {!user && <SignIn />}
          </ClerkLoaded> */}
        </div>
      </Container>
    </header>
  );
};

export default Header;

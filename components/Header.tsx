import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import SignIn from "./SignIn";
import MobileMenu from "./MobileMenu";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Logs } from "lucide-react";
import { getMyOrders } from "@/sanity/queries";

const Header = async () => {
  const user = await currentUser();
  const { userId } = await auth();
  let orders = null;
  if (userId) {
    orders = await getMyOrders(userId);
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <Container className="flex items-center justify-between h-16">
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
        <div className="flex items-center gap-4">
          <SearchBar />
          <CartIcon />
          <FavoriteButton />
          {user && (
            <Link href={"/orders"} className="group relative text-gray-700 hover:text-orange-500">
              <Logs />
              <span className="absolute -top-1 -right-1 bg-shop_btn_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                {orders?.length ? orders?.length : 0}
              </span>
            </Link>
          )}
          <ClerkLoaded>
            <SignedIn>
              <UserButton />
            </SignedIn>
            {!user && <SignIn />}
          </ClerkLoaded>
        </div>
      </Container>
    </header>
  );
};

export default Header;

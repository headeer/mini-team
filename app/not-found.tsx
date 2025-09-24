import Logo from "@/components/Logo";
import Link from "next/link";
import React from "react";
import { Home, ShoppingBag, Search } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 md:py-32">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Logo />
          <div className="h-2 w-full rounded-full bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] mt-6" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Nie znaleziono strony</h2>
          <p className="mt-2 text-sm text-gray-600">Wygląda na to, że ten adres nie istnieje lub został przeniesiony.</p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/" className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] hover:opacity-95">
              <Home className="w-5 h-5" /> Start
            </Link>
            <Link href="/shop" className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-[var(--color-brand-orange)] text-[var(--color-brand-orange)] bg-white hover:bg-orange-50 font-semibold">
              <ShoppingBag className="w-5 h-5" /> Sklep
            </Link>
            <Link href="/shop" className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-gray-300 text-gray-800 bg-white hover:bg-gray-50 font-semibold">
              <Search className="w-5 h-5" /> Szukaj
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">Potrzebujesz pomocy? Napisz: <a href="mailto:teodorczykpt@gmail.com" className="underline">teodorczykpt@gmail.com</a> lub zadzwoń: <a href="tel:+48782851962" className="underline">782‑851‑962</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

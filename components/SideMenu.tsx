import React, { FC } from "react";
import Logo from "./Logo";
import { X } from "lucide-react";
import { headerData } from "@/constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialMedia from "./SocialMedia";
import { useOutsideClick } from "@/hooks";
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
}

const SideMenu: FC<SidebarProps> = ({ isOpen, onClose, user }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"} transition-opacity duration-200`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${isOpen ? "" : "hidden"}`} onClick={onClose} />
      <div
        ref={sidebarRef}
        className={`absolute left-0 top-0 h-full w-[88vw] max-w-[360px] bg-gradient-to-b from-[#0b0b0b] to-[#141414] text-white/80 p-6 border-r border-white/10 flex flex-col gap-6 sm:p-8 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-out rounded-r-2xl shadow-2xl`}
      >
        <div className="flex items-center justify-between gap-5">
          <Logo className="text-white" spanDesign="group-hover:text-white" />
          <button onClick={onClose} className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col space-y-2 font-semibold tracking-wide">
          {headerData?.filter((item) => item?.href !== "/orders" || user) // Hide orders if not logged in
            .map((item) => (
            <Link
              href={item?.href}
              key={item?.title}
              onClick={onClose}
              className={`px-3 py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors ${pathname === item?.href ? "text-white bg-white/15" : ""}`}
            >
              {item?.title}
            </Link>
          ))}
        </div>
        <div className="mt-2">
          <SocialMedia />
        </div>
        {/* Mobile quick tools */}
        <div className="mt-auto space-y-2 md:hidden">
          <div className="text-xs text-white/60">Szybkie narzędzia</div>
          <div className="grid grid-cols-2 gap-2">
            <a href="#a11y" onClick={onClose} className="px-3 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10">Dostępność</a>
            <a href="#fit-check" onClick={onClose} className="px-3 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10">Wyślij zdjęcie</a>
            <a href="#machine-finder" onClick={onClose} className="px-3 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10">Dobierz maszynę</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;

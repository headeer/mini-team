import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const Logo = ({
  className,
  spanDesign,
}: {
  className?: string;
  spanDesign?: string;
}) => {
  return (
    <Link href={"/"} className="inline-flex items-center gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-brand-orange)] to-[var(--color-brand-red)] rounded-lg flex items-center justify-center">
        <span className="text-white text-base font-bold">MT</span>
      </div>
      <h2 className={cn("text-2xl font-extrabold tracking-tight", className)}>
        MiniTeam
        <span className={cn("text-[var(--color-brand-orange)]", spanDesign)}>
          Project
        </span>
      </h2>
    </Link>
  );
};

export default Logo;

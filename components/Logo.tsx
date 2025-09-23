import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const Logo = ({
  className,
  spanDesign,
}: {
  className?: string;
  spanDesign?: string;
}) => {
  return (
    <Link href={"/"} className="inline-flex items-center gap-2" aria-label="Mini Team Project – Strona główna">
      <Image
        src="/assets/logo_mini_team_project.png"
        alt="MTP – Mini Team Project"
        width={120}
        height={120}
        className="h-8 w-auto md:h-10"
        priority
      />
    </Link>
  );
};

export default Logo;

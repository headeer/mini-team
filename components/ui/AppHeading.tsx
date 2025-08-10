import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "left" | "center";
  className?: string;
};

const AppHeading: React.FC<Props> = ({ title, subtitle, eyebrow, align = "center", className }) => {
  return (
    <div className={cn("space-y-3", align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow ? (
        <Badge className="bg-[var(--color-brand-orange)] text-white inline-block">{eyebrow}</Badge>
      ) : null}
      <h2 className={cn("font-bold text-gray-900", align === "center" ? "text-3xl lg:text-4xl" : "text-2xl lg:text-3xl")}>{title}</h2>
      {subtitle ? <p className="text-gray-600 max-w-3xl mx-auto pb-2">{subtitle}</p> : null}
    </div>
  );
};

export default AppHeading;


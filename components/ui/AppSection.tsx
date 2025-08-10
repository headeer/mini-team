import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  container?: boolean;
};

const AppSection: React.FC<Props> = ({ children, className }) => {
  return <section className={cn("py-8 md:py-10", className)}>{children}</section>;
};

export default AppSection;


import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof Card>;

const AppCard: React.FC<Props> = ({ className, ...rest }) => (
  <Card {...rest} className={cn("border rounded-xl shadow-sm hover:shadow-md transition-shadow", className)} />
);

export default AppCard;


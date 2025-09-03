"use client";

import React from "react";
import { Product } from "@/sanity.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AddToCartButton from "./AddToCartButton";
import ABCDGuide from "./ABCDGuide";

type WithTeeth = Product & { toothCost?: number; teethEnabled?: boolean };

export default function BucketConfigurator({ product }: { product: WithTeeth }) {
  const [dims, setDims] = React.useState<{ A?: number; B?: number; C?: number; D?: number }>({});
  const [hasQuickCouplerChoice, setHasQuickCouplerChoice] = React.useState<'yes'|'no'>('yes');
  const [fixedPins, setFixedPins] = React.useState<boolean>(false);
  // Usuwamy pola kinetyka/ramię/sworzeń (A/B/C/D zastępują te wielkości)
  const [addTeeth, setAddTeeth] = React.useState<boolean>(false);

  const totalExtras = React.useMemo(() => (addTeeth ? (product?.toothCost || 0) : 0), [addTeeth, product?.toothCost]);

  return (
    <div className="space-y-4 border rounded-lg p-3 bg-white">
      <div className="text-sm text-gray-700">Wypełnij dane, abyśmy dobrali właściwe mocowanie.</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Label>Posiadasz szybkozłącze?</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-gray-500 underline cursor-help">i</span>
                </TooltipTrigger>
                <TooltipContent>Jeśli tak, wybierz mocowanie pod szybkozłącze. Gdy nie – rozważ sworznie na stałe, by ograniczyć koszt sworzni.</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <RadioGroup value={hasQuickCouplerChoice} onValueChange={(v) => setHasQuickCouplerChoice((v as any) || 'yes')} className="flex items-center gap-4 text-sm">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value="yes" id="qc-yes" />
              Tak
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value="no" id="qc-no" />
              Nie
            </label>
          </RadioGroup>
          {hasQuickCouplerChoice === 'yes' ? (
            <div className="mt-2 text-sm">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <Checkbox checked={fixedPins} onCheckedChange={(v) => setFixedPins(Boolean(v))} />
                Zastosuj sworznie na stałe (opcjonalnie)
              </label>
            </div>
          ) : null}
        </div>
      </div>

      {/* Usunięto pola kinetyka/ramię/sworzeń – użytkownik poda A/B/C/D poniżej */}

      <div className="space-y-2">
        <div className="text-xs uppercase text-gray-500">Wymiary mocowania (A/B/C/D)</div>
        <ABCDGuide onChange={(d) => setDims(d)} />
      </div>

      {product?.teethEnabled ? (
        <label className="inline-flex items-center gap-2 text-sm">
          <Checkbox checked={addTeeth} onCheckedChange={(v) => setAddTeeth(Boolean(v))} />
          Doposażenie w zęby {typeof product.toothCost === 'number' ? `(+${product.toothCost} zł netto)` : ''}
        </label>
      ) : null}

      <div className="pt-2">
        <AddToCartButton 
          product={product}
          extraConfiguration={{ dimensions: dims }}
          className="w-full"
          disabled={!dims.A || !dims.B || !dims.C || !dims.D}
        />
        {totalExtras > 0 && (
          <div className="text-xs text-gray-600 mt-1">Cena + dopłaty: +{totalExtras} zł netto (zęby)</div>
        )}
      </div>
    </div>
  );
}



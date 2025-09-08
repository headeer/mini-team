"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Hammer, Plus, CheckCircle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProminentTeethOptionProps {
  product: {
    toothCost?: number;
    toothQty?: number;
    teethEnabled?: boolean;
    name?: string;
  };
  addTeeth: boolean;
  onTeethChange: (enabled: boolean) => void;
}

export default function ProminentTeethOption({ 
  product, 
  addTeeth, 
  onTeethChange 
}: ProminentTeethOptionProps) {
  // Only show if product has tooth cost and quantity (allow 0 values)
  if (product.toothCost === undefined || product.toothCost === null || 
      product.toothQty === undefined || product.toothQty === null) {
    return null;
  }

  // Don't show if both values are 0 (no teeth option available)
  if (product.toothCost === 0 && product.toothQty === 0) {
    return null;
  }

  // toothCost is ALWAYS the total cost for all teeth, not per-tooth cost
  const totalTeethCost = product.toothCost;

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 self-center sm:self-start">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Hammer className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Doposażenie w zęby
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button"
                      className="p-1 -m-1 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Informacje o zębach"
                    >
                      <Info className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">
                      Zęby zwiększają efektywność kopania i chronią łyżkę przed zużyciem. 
                      Wykonane z wysokiej jakości stali Hardox HB500.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {addTeeth && (
              <CheckCircle className="w-5 h-5 text-green-600 self-start sm:self-center" />
            )}
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-700">
              <span className="font-medium">Ilość zębów:</span>
              <span className="bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full text-xs font-bold inline-block w-fit">
                {product.toothQty} szt
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-700">
              <span className="font-medium">Koszt łącznie:</span>
              <span className="font-bold text-orange-600 text-lg">
                {totalTeethCost} zł netto
              </span>
            </div>
          </div>
          
          {/* Prominent Checkbox */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <Checkbox 
                id="teeth-option"
                checked={addTeeth} 
                onCheckedChange={(checked) => onTeethChange(!!checked)}
                className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-orange-400 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 flex-shrink-0"
              />
              <Label 
                htmlFor="teeth-option" 
                className="text-sm sm:text-base font-semibold text-gray-900 cursor-pointer flex items-center gap-2 flex-1"
              >
                {addTeeth ? (
                  <>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Tak, dodaj zęby do łyżki</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Kliknij, aby dodać zęby do łyżki</span>
                  </>
                )}
              </Label>
            </div>
          </div>
          
          {addTeeth && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium text-xs sm:text-sm">
                  Zęby zostaną dodane do zamówienia (+{totalTeethCost} zł netto)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

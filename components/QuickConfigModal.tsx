"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Product } from "@/sanity.types";
import useStore from "@/store";
import toast from "react-hot-toast";
import { X } from "lucide-react";

interface QuickConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function QuickConfigModal({ isOpen, onClose, product }: QuickConfigModalProps) {
  const { addConfiguredItem } = useStore();
  const [dims, setDims] = useState<{ A?: number; B?: number; C?: number; D?: number }>({});
  const [hasQuickCouplerChoice, setHasQuickCouplerChoice] = useState<'yes'|'no'>('yes');
  const [fixedPins, setFixedPins] = useState<boolean>(false);
  const [addTeeth, setAddTeeth] = useState<boolean>(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const totalExtras = React.useMemo(() => (addTeeth ? (product?.toothCost || 0) : 0), [addTeeth, product?.toothCost]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const uploadPhoto = async () => {
    if (!photoFile) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', photoFile);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setPhotoPreview(data.url);
        toast.success("Zdjęcie przesłane");
      }
    } catch (_error) {
      toast.error("Błąd podczas przesyłania zdjęcia");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Validate required dimensions
    if (!dims.A || !dims.B || !dims.C || !dims.D) {
      toast.error("Wypełnij wszystkie wymiary A/B/C/D");
      return;
    }

    addConfiguredItem(product, {
      dimensions: dims,
      photoAssetId: photoPreview || undefined,
      teeth: addTeeth ? { enabled: true, price: product?.toothCost } : undefined,
    });

    toast.success("Dodano do koszyka z konfiguracją");
    onClose();
    
    // Reset form
    setDims({});
    setHasQuickCouplerChoice('yes');
    setFixedPins(false);
    setAddTeeth(false);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Konfiguracja: {product.name}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Coupler Choice */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Wypełnij dane, abyśmy dobrali właściwe mocowanie.
            </Label>
            <RadioGroup value={hasQuickCouplerChoice} onValueChange={(value: 'yes'|'no') => setHasQuickCouplerChoice(value)}>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="yes" id="yes" className="w-6 h-6 sm:w-5 sm:h-5" />
                <Label htmlFor="yes">Tak</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="no" id="no" className="w-6 h-6 sm:w-5 sm:h-5" />
                <Label htmlFor="no">Nie</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Fixed Pins */}
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="fixedPins" 
              checked={fixedPins} 
              onCheckedChange={(checked) => setFixedPins(!!checked)} 
              className="w-6 h-6 sm:w-5 sm:h-5"
            />
            <Label htmlFor="fixedPins">Zastosuj sworznie na stałe (opcjonalnie)</Label>
          </div>

          {/* Standard Mountings */}
          <div>
            <Label className="text-base font-semibold mb-2 block">
              Standardowe mocowania (szybkozłącze)
            </Label>
            <div className="flex gap-2 flex-wrap">
              {['MS01', 'MS03', 'CW05', 'CW10'].map((code) => (
                <Button
                  key={code}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  {code}
                </Button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Pasujące pod szybkozłącze. W razie wątpliwości wyślij zdjęcie uchwytu.
            </p>
          </div>

          {/* Dimensions */}
          <div>
            <Label className="text-base font-semibold mb-2 block">
              Wymiary mocowania (A/B/C/D)
            </Label>
            <p className="text-sm text-gray-600 mb-3">
              Jak zmierzyć mocowanie: A/B/C/D
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dimA">A (cm)</Label>
                <Input
                  id="dimA"
                  type="number"
                  step="0.1"
                  placeholder="np. 12.5"
                  value={dims.A || ''}
                  onChange={(e) => setDims(prev => ({ ...prev, A: parseFloat(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="dimB">B (cm)</Label>
                <Input
                  id="dimB"
                  type="number"
                  step="0.1"
                  placeholder="np. 12.5"
                  value={dims.B || ''}
                  onChange={(e) => setDims(prev => ({ ...prev, B: parseFloat(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="dimC">C (cm)</Label>
                <Input
                  id="dimC"
                  type="number"
                  step="0.1"
                  placeholder="np. 12.5"
                  value={dims.C || ''}
                  onChange={(e) => setDims(prev => ({ ...prev, C: parseFloat(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="dimD">D (cm)</Label>
                <Input
                  id="dimD"
                  type="number"
                  step="0.1"
                  placeholder="np. 12.5"
                  value={dims.D || ''}
                  onChange={(e) => setDims(prev => ({ ...prev, D: parseFloat(e.target.value) }))}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Podaj wymiary wg grafiki. Zapiszemy je przy pozycji w koszyku.
            </p>
          </div>

          {/* Photo Upload */}
          <div>
            <Label className="text-base font-semibold mb-2 block">
              Zdjęcie uchwytu (opcjonalne)
            </Label>
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="text-sm"
              />
              {photoPreview && (
                <div className="mt-2">
                  <img src={photoPreview} alt="Preview" className="w-32 h-32 object-cover rounded border" />
                  <Button
                    onClick={uploadPhoto}
                    disabled={isUploading}
                    size="sm"
                    className="mt-2"
                  >
                    {isUploading ? "Przesyłanie..." : "Wyślij do nas"}
                  </Button>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Dodaj zdjęcie uchwytu szybkozłącza, jeśli nie jesteś pewien kodu.
            </p>
          </div>

          {/* Teeth Option */}
          {product.teethEnabled && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="addTeeth" 
                checked={addTeeth} 
                onCheckedChange={(checked) => setAddTeeth(!!checked)} 
              />
              <Label htmlFor="addTeeth">
                Doposażenie w zęby {typeof product.toothCost === 'number' ? `(+${product.toothCost} zł netto)` : ''}
              </Label>
            </div>
          )}

          {/* Total Extras */}
          {totalExtras > 0 && (
            <div className="text-sm text-gray-600">
              Cena + dopłaty: +{totalExtras} zł netto (zęby)
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Anuluj
            </Button>
            <Button 
              onClick={handleAddToCart}
              disabled={!dims.A || !dims.B || !dims.C || !dims.D}
              className="flex-1 bg-[var(--color-brand-red)] hover:bg-[var(--color-brand-orange)]"
            >
              Dodaj do koszyka
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

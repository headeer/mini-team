"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Send, FileText, Clock } from "lucide-react";
import { useState } from "react";

const ObrobkaContactForm = () => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  return (
    <section id="wycena" className="space-y-8">
      <div className="text-center space-y-4">
        <Badge className="bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] text-white">
          Bezpłatna Wycena
        </Badge>
        <h2 className="text-3xl font-bold text-gray-900">Wyślij plik DXF/DWG – wycena w 2 godziny</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Profesjonalna wycena z doradztwo technologicznym w cenie
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Process Steps */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Jak to działa?</h3>
          
          {[
            { icon: Upload, title: "1. Wyślij plik", desc: "DXF, DWG lub szkic z wymiarami" },
            { icon: FileText, title: "2. Otrzymaj wycenę", desc: "Szczegółową kalkulację w 2h" },
            { icon: Clock, title: "3. Potwierdzenie", desc: "Akceptacja i start produkcji" }
          ].map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              </div>
            );
          })}

          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="text-center">
                <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="font-bold text-orange-900">Gwarantujemy odpowiedź</div>
                <div className="text-sm text-orange-700">w ciągu 2 godzin roboczych</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <Card className="lg:col-span-2 border-0 shadow-xl">
          <CardContent className="p-8">
            <form method="post" action="/api/contact" encType="multipart/form-data" className="space-y-6">
              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Imię i firma *
                  </Label>
                  <Input 
                    id="name" 
                    name="name" 
                    required 
                    placeholder="Jan Kowalski / ACME Sp. z o.o."
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Telefon *
                  </Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    required 
                    placeholder="+48 570 037 128"
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    E-mail *
                  </Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    placeholder="jan@firma.pl"
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    Miasto
                  </Label>
                  <Input 
                    id="city" 
                    name="city"
                    placeholder="Wrocław"
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material" className="text-sm font-medium text-gray-700">
                    Materiał
                  </Label>
                  <select 
                    id="material" 
                    name="material" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500 focus:ring-orange-500"
                  >
                    <option>Stal czarna (S235/S355)</option>
                    <option>Stal nierdzewna (304/316)</option>
                    <option>Aluminium</option>
                    <option>Inne/nie wiem</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thickness" className="text-sm font-medium text-gray-700">
                    Grubość (mm)
                  </Label>
                  <Input 
                    id="thickness" 
                    name="thickness" 
                    type="number" 
                    min={0} 
                    step="0.1" 
                    placeholder="np. 3"
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Rodzaj usługi
                </Label>
                <select 
                  name="service" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-orange-500 focus:ring-orange-500"
                >
                  <option>Cięcie + gięcie (ALL-IN-ONE)</option>
                  <option>Tylko cięcie laserem</option>
                  <option>Tylko gięcie CNC</option>
                  <option>Nie wiem – proszę o doradztwo</option>
                </select>
              </div>

              {/* Deadline */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Termin realizacji
                </Label>
                <RadioGroup defaultValue="standard" name="deadline" className="grid md:grid-cols-3 gap-3">
                  <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-colors" htmlFor="tr1">
                    <RadioGroupItem value="standard" id="tr1" className="text-orange-600" />
                    <div>
                      <div className="font-medium text-gray-900">Standardowo</div>
                      <div className="text-sm text-gray-600">48–72h</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-colors" htmlFor="tr2">
                    <RadioGroupItem value="fast" id="tr2" className="text-orange-600" />
                    <div>
                      <div className="font-medium text-gray-900">Szybko</div>
                      <div className="text-sm text-gray-600">24–48h (+20%)</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-colors" htmlFor="tr3">
                    <RadioGroupItem value="express" id="tr3" className="text-orange-600" />
                    <div>
                      <div className="font-medium text-gray-900">Express</div>
                      <div className="text-sm text-gray-600">do 24h (+30%)</div>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                  Opis zlecenia i ilość elementów *
                </Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  rows={4} 
                  required 
                  placeholder="Opisz zakres prac, ilości, tolerancje, specjalne wymagania..."
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file" className="text-sm font-medium text-gray-700">
                  Załącz plik DXF/DWG (opcjonalnie)
                </Label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive ? 'border-orange-400 bg-orange-50' : 'border-gray-300 hover:border-orange-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600 mb-2">Przeciągnij plik tutaj lub kliknij aby wybrać</div>
                  <Input 
                    id="file" 
                    name="file" 
                    type="file" 
                    accept=".dxf,.dwg,.pdf,.jpg,.png" 
                    className="hidden"
                  />
                  <label htmlFor="file" className="text-orange-600 hover:text-orange-700 cursor-pointer">
                    Wybierz plik
                  </label>
                  <div className="text-xs text-gray-500 mt-1">
                    DXF, DWG, PDF, JPG, PNG (max 10MB)
                  </div>
                </div>
              </div>

              {/* RODO */}
              <div className="flex items-start gap-3">
                <input 
                  id="rodo" 
                  name="rodo" 
                  type="checkbox" 
                  required 
                  className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="rodo" className="text-sm text-gray-700 leading-relaxed">
                  Wyrażam zgodę na przetwarzanie danych osobowych w celu przygotowania oferty zgodnie z 
                  <a href="/polityka-prywatnosci" className="text-orange-600 hover:text-orange-700"> Polityką Prywatności</a>. *
                </label>
              </div>

              {/* Submit */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] hover:scale-105 transition-transform text-lg py-6"
              >
                <Send className="w-5 h-5 mr-2" />
                WYŚLIJ ZAPYTANIE – WYCENA W 2H
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ObrobkaContactForm;
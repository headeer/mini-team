"use client";
import React, { useEffect, useRef, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, CheckCircle2, Phone } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const compressImage = async (file: File, quality = 0.8, maxWidth = 1600): Promise<File> => {
  try {
    const img = document.createElement("img");
    const reader = new FileReader();
    const loaded = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    img.src = loaded;
    await new Promise((res) => (img.onload = () => res(null)));
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, maxWidth / img.width);
    canvas.width = Math.floor(img.width * scale);
    canvas.height = Math.floor(img.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.(png|webp)$/i, ".jpg"), { type: "image/jpeg" });
  } catch {
    return file;
  }
};

const AIWidgetStub = () => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [rodo, setRodo] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onHash = () => { if (window.location.hash === "#fit-check") setOpen(true); };
    const onOpen = () => setOpen(true);
    onHash();
    window.addEventListener("hashchange", onHash);
    window.addEventListener("open-fit-check", onOpen as EventListener);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("open-fit-check", onOpen as EventListener);
    };
  }, []);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!rodo) {
      alert("Zaznacz zgodę RODO, aby wysłać zdjęcia.");
      return;
    }
    const form = e.currentTarget;
    const formData = new FormData(form);
    // move and compress files from the input into formData
    const files = Array.from((form.elements.namedItem("images") as HTMLInputElement)?.files || []);
    // clear existing images appended by native form
    formData.delete("images");
    for (const file of files) {
      const compressed = await compressImage(file);
      if (compressed.size > 5 * 1024 * 1024) {
        alert(`Plik ${compressed.name} ma ponad 5MB. Zmniejsz rozmiar i spróbuj ponownie.`);
        continue;
      }
      formData.append("images", compressed);
    }
    // ensure rodo flag is present in payload
    formData.set("rodo", "on");
    setSubmitting(true);
    try {
      const res = await fetch("/api/fit-check", { method: "POST", body: formData });
      const body = await res.json();
      if (!res.ok || !body?.ok) {
        const msg = body?.error || "Nie udało się wysłać zgłoszenia. Spróbuj ponownie.";
        alert(msg);
        setOk(false);
        return;
      }
      if (Array.isArray(body.rejected) && body.rejected.length) {
        alert(`Część plików odrzucono: \n` + body.rejected.map((r: any) => `• ${r.name}: ${r.reason}`).join("\n"));
      }
      setOk(true);
      form.reset();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Desktop: modal can be opened via custom event; trigger button hidden */}
      <div className="fixed bottom-32 sm:bottom-6 right-4 sm:right-6 z-40 hidden">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="group relative h-12 w-12 bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-red)] text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95">
              {/* Animated background pulse */}
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-30"></div>
              
              {/* Icon with hover effect */}
              <Camera className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            </button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">Nie wiesz, czy będzie pasować? Wyślij zdjęcie 📷</DialogTitle>
            </DialogHeader>
            {ok ? (
              <div className="p-2 flex items-start gap-3 text-green-700 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle2 className="mt-0.5" />
                <div>
                  <p className="font-semibold">Dziękujemy!</p>
                  <p className="text-sm">Nasz technik potwierdzi kompatybilność w ciągu 24h.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4" method="post" action="/api/fit-check" encType="multipart/form-data">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Imię i nazwisko*</label>
                    <Input name="name" required placeholder="Jan Kowalski" className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Telefon*</label>
                    <Input name="phone" required placeholder="782-851-962" inputMode="tel" className="w-full" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input name="email" type="email" placeholder="jan@firma.pl" className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Rodzaj osprzętu</label>
                    <Input name="attachmentType" placeholder="np. łyżka 60 cm MS03" className="w-full" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Marka maszyny</label>
                    <Input name="machineBrand" placeholder="np. JCB" className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Model maszyny</label>
                    <Input name="machineModel" placeholder="np. 8018" className="w-full" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Zdjęcia* (max 5MB)</label>
                  <div className="rounded-md border-2 border-dashed border-gray-300 p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <input ref={fileInputRef} name="images" type="file" accept="image/*" capture="environment" multiple required className="w-full text-sm" />
                    <p className="text-xs text-gray-500 mt-2">Wybierz zdjęcia szybkozłącza i osprzętu</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Wiadomość</label>
                  <Textarea name="message" rows={3} placeholder="Opisz czego potrzebujesz" className="w-full" />
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox id="rodo-fit" checked={rodo} onCheckedChange={(v) => setRodo(Boolean(v))} className="mt-0.5" />
                  <Label htmlFor="rodo-fit" className="text-xs text-gray-600 font-normal leading-snug">
                    Wyrażam zgodę na przetwarzanie danych w celu potwierdzenia kompatybilności.
                  </Label>
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                  <Button type="button" asChild variant="outline" className="border-gray-300 w-full sm:w-auto">
                    <a href="tel:+48782851962" className="flex items-center justify-center">
                      <Phone className="h-4 w-4 mr-2" /> 782-851-962
                    </a>
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={submitting} 
                    className="bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)] w-full sm:w-auto font-semibold py-3"
                  >
                    {submitting ? "Wysyłanie..." : "Wyślij zgłoszenie"}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Potwierdzimy dopasowanie w ciągu 24h.</p>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* removed old AI placeholder section */}
    </>
  );
};

export default AIWidgetStub;


"use client";
import React, { useEffect, useRef, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, CheckCircle2, Phone } from "lucide-react";

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onHash = () => {
      if (window.location.hash === "#fit-check") setOpen(true);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
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
      {/* Floating Fit Check Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="h-12 w-12 bg-[var(--color-brand-orange)] text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center">
              <Camera className="h-5 w-5" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Nie wiesz, czy będzie pasować? Wyślij zdjęcie 📷</DialogTitle>
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
              <form onSubmit={onSubmit} className="space-y-3" method="post" action="/api/fit-check" encType="multipart/form-data">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Imię i nazwisko*</label>
                    <Input name="name" required placeholder="Jan Kowalski" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Telefon*</label>
                    <Input name="phone" required placeholder="782-851-962" inputMode="tel" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input name="email" type="email" placeholder="jan@firma.pl" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Rodzaj osprzętu</label>
                    <Input name="attachmentType" placeholder="np. łyżka 60 cm MS03" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Marka maszyny</label>
                    <Input name="machineBrand" placeholder="np. JCB" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Model maszyny</label>
                    <Input name="machineModel" placeholder="np. 8018" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Zdjęcia* (max 5MB)</label>
                  <div className="rounded-md border p-3 bg-gray-50">
                    <input ref={fileInputRef} name="images" type="file" accept="image/*" capture="environment" multiple required />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Wiadomość</label>
                  <Textarea name="message" rows={3} placeholder="Opisz czego potrzebujesz" />
                </div>
                <div className="flex items-start gap-2">
                  <input id="rodo-fit" name="rodo" type="checkbox" required className="mt-1" />
                  <label htmlFor="rodo-fit" className="text-xs text-gray-600">Wyrażam zgodę na przetwarzanie danych w celu potwierdzenia kompatybilności.</label>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                  <Button type="button" asChild variant="outline" className="border-gray-300">
                    <a href="tel:+48782851962"><Phone className="h-4 w-4 mr-2" /> 782-851-962</a>
                  </Button>
                  <Button type="submit" disabled={submitting} className="bg-gradient-to-r from-[var(--color-brand-red)] to-[var(--color-brand-orange)]">
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


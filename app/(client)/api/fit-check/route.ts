import { NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { projectId, dataset } from "@/sanity/env";

export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const machineBrand = String(formData.get("machineBrand") || "").trim();
    const machineModel = String(formData.get("machineModel") || "").trim();
    const attachmentType = String(formData.get("attachmentType") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !phone) {
      return NextResponse.json({ ok: false, error: "Brak wymaganych pól: imię i nazwisko, telefon" }, { status: 400 });
    }

    // Upload images to Sanity first (convert File -> Buffer for Node runtime)
    const images: any[] = [];
    const files = formData.getAll("images");
    const rejected: Array<{ name: string; reason: string }> = [];
    for (const file of files) {
      if (file instanceof File) {
        const typeOk = /image\/(png|jpe?g|webp)/i.test(file.type);
        const sizeOk = file.size <= 5 * 1024 * 1024; // 5MB
        if (!typeOk || !sizeOk) {
          rejected.push({ name: file.name, reason: !typeOk ? "Niedozwolony format" : "Za duży rozmiar (max 5MB)" });
          continue;
        }
        const buf = Buffer.from(await file.arrayBuffer());
        const asset = await backendClient.assets.upload("image", buf, {
          filename: file.name,
          contentType: file.type,
        });
        images.push({ _type: "image", asset: { _type: "reference", _ref: asset._id } });
      }
    }

    const doc = {
      _type: "fitCheck",
      name,
      phone,
      email,
      machineBrand,
      machineModel,
      attachmentType,
      message,
      images,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    const created = await backendClient.create(doc);

    // Send emails (user + admin) via Resend
    try {
      const RESEND_API_KEY = process.env.RESEND_API_KEY;
      const FROM = process.env.ORDER_EMAIL_FROM || process.env.RESEND_FROM;
      const ADMIN = process.env.ORDER_EMAIL_BCC || process.env.ORDER_EMAIL_ADMIN || 'teodorczykpt@gmail.com';
      if (RESEND_API_KEY && FROM) {
        const html = `
          <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111">
            <h2 style="margin:0 0 8px">Nowe zgłoszenie Fit Check</h2>
            <p style="margin:0 0 10px">Sprawdzimy dopasowanie osprzętu do maszyny.</p>
            <table style="width:100%;border-collapse:collapse">
              <tbody>
                <tr><td style="padding:6px 8px;color:#555">Imię i nazwisko:</td><td style="padding:6px 8px"><strong>${name || '-'}</strong></td></tr>
                <tr><td style="padding:6px 8px;color:#555">Telefon:</td><td style="padding:6px 8px"><strong>${phone || '-'}</strong></td></tr>
                <tr><td style="padding:6px 8px;color:#555">Email:</td><td style="padding:6px 8px"><strong>${email || '-'}</strong></td></tr>
                <tr><td style="padding:6px 8px;color:#555">Marka maszyny:</td><td style="padding:6px 8px">${machineBrand || '-'}</td></tr>
                <tr><td style="padding:6px 8px;color:#555">Model maszyny:</td><td style="padding:6px 8px">${machineModel || '-'}</td></tr>
                <tr><td style="padding:6px 8px;color:#555">Rodzaj osprzętu:</td><td style="padding:6px 8px">${attachmentType || '-'}</td></tr>
                <tr><td style="padding:6px 8px;color:#555">Wiadomość:</td><td style="padding:6px 8px;white-space:pre-line">${message || '-'}</td></tr>
                <tr><td style="padding:6px 8px;color:#555">Zdjęcia:</td><td style="padding:6px 8px">${images.length} plik(ów)</td></tr>
              </tbody>
            </table>
            <p style="margin:12px 0">Kontakt: <a href="mailto:teodorczykpt@gmail.com">teodorczykpt@gmail.com</a> • <a href="tel:+48782851962">782‑851‑962</a></p>
          </div>
        `;
        const send = async (to: string | null | undefined, subject: string) => {
          if (!to) return;
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: FROM, to, subject, html, bcc: ADMIN })
          });
        };
        await send(email || undefined, 'Zgłoszenie Fit Check – Mini Team Project');
        await send(ADMIN, `Nowe Fit Check (${name || phone || email || 'Klient'})`);
      }
    } catch {
      // ignore email errors
    }

    return NextResponse.json({ ok: true, id: created._id, rejected, cdn: `https://cdn.sanity.io/images/${projectId}/${dataset}/` });
  } catch (error) {
    console.error("FitCheck error:", error);
    return NextResponse.json({ ok: false, error: String((error as Error)?.message || "Błąd przetwarzania zgłoszenia") }, { status: 500 });
  }
}




import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';
import { verifyRecaptcha } from '@/lib/recaptcha';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Verify reCAPTCHA
    const recaptchaToken = formData.get('recaptchaToken') as string;
    const recaptchaResult = await verifyRecaptcha(recaptchaToken, 'contact_form');
    
    if (!recaptchaResult.success) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Weryfikacja reCAPTCHA nie powiodła się. Spróbuj ponownie.' 
      }, { status: 400 });
    }
    const doc: any = {
      _type: 'serviceInquiry',
      service: String(formData.get('service') || ''),
      name: String(formData.get('name') || ''),
      phone: String(formData.get('phone') || ''),
      email: String(formData.get('email') || ''),
      city: String(formData.get('city') || ''),
      material: String(formData.get('material') || ''),
      thickness: formData.get('thickness') ? Number(formData.get('thickness')) : undefined,
      quantity: formData.get('quantity') ? Number(formData.get('quantity')) : undefined,
      bendLength: formData.get('bendLength') ? Number(formData.get('bendLength')) : undefined,
      operations: String(formData.get('operations') || ''),
      deadline: String(formData.get('deadline') || ''),
      message: String(formData.get('message') || ''),
      createdAt: new Date().toISOString(),
    };
    const created = await backendClient.create(doc);

    // Email (admin + user) via Resend
    try {
      const RESEND_API_KEY = process.env.RESEND_API_KEY;
      const FROM = process.env.ORDER_EMAIL_FROM || process.env.RESEND_FROM;
      const ADMIN = process.env.ORDER_EMAIL_BCC || process.env.ORDER_EMAIL_ADMIN || 'teodorczykpt@gmail.com';
      if (RESEND_API_KEY && FROM) {
        const html = `
          <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111">
            <h2 style="margin:0 0 8px">Nowe zapytanie (Kontakt/Obróbka blach)</h2>
            <table style="width:100%;border-collapse:collapse">
              <tbody>
                <tr><td style="padding:6px 8px;color:#555">Usługa:</td><td style="padding:6px 8px"><strong>${doc.service || '-'}</strong></td></tr>
                <tr><td style="padding:6px 8px;color:#555">Imię i nazwisko:</td><td style="padding:6px 8px"><strong>${doc.name || '-'}</strong></td></tr>
                <tr><td style="padding:6px 8px;color:#555">Telefon:</td><td style="padding:6px 8px">${doc.phone || '-'}</td></tr>
                <tr><td style="padding:6px 8px;color:#555">Email:</td><td style="padding:6px 8px">${doc.email || '-'}</td></tr>
                <tr><td style="padding:6px 8px;color:#555">Miasto:</td><td style="padding:6px 8px">${doc.city || '-'}</td></tr>
                <tr><td style="padding:6px 8px;color:#555">Materiał:</td><td style="padding:6px 8px">${doc.material || '-'}</td></tr>
                <tr><td style="padding:6px 8px;color:#555">Grubość:</td><td style="padding:6px 8px">${doc.thickness ?? '-'}</td></tr>
                <tr><td style="padding:6px 8px;color:#555">Ilość:</td><td style="padding:6px 8px">${doc.quantity ?? '-'}</td></tr>
                <tr><td style="padding:6px 8px;color:#555">Długość gięcia:</td><td style="padding:6px 8px">${doc.bendLength ?? '-'}</td></tr>
                <tr><td style="padding:6px 8px;color:#555">Operacje:</td><td style="padding:6px 8px;white-space:pre-line">${doc.operations || '-'}</td></tr>
                <tr><td style="padding:6px 8px;color:#555">Termin:</td><td style="padding:6px 8px">${doc.deadline || '-'}</td></tr>
                <tr><td style="padding:6px 8px;color:#555">Wiadomość:</td><td style="padding:6px 8px;white-space:pre-line">${doc.message || '-'}</td></tr>
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
        await send(doc.email || undefined, 'Potwierdzenie zgłoszenia – Mini Team Project');
        await send(ADMIN, `Nowe zapytanie od: ${doc.name || doc.email || doc.phone || 'Klient'}`);
      }
    } catch {}

    return NextResponse.json({ ok: true, id: created._id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}


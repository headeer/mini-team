import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
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
    return NextResponse.json({ ok: true, id: created._id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    // TODO: integrate with email/CRM/Sanity if needed
    // e.g., create a document in Sanity: { _type: 'contactMessage', ... }

    return NextResponse.json({ ok: true, received: data });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ ok: false, error: "Failed to submit form" }, { status: 500 });
  }
}


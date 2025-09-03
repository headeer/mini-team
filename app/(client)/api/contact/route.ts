import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

export const dynamic = 'force-dynamic';

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


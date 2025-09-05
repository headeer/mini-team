import { NextResponse } from 'next/server';
import { backendClient } from '@/sanity/lib/backendClient';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || !(file as File).arrayBuffer) {
      return NextResponse.json({ ok: false, error: 'Brak pliku' }, { status: 400 });
    }
    const f = file as File;
    const buffer = Buffer.from(await f.arrayBuffer());
    const asset = await backendClient.assets.upload('image', buffer, {
      filename: f.name || 'upload.jpg',
      contentType: f.type || 'image/jpeg',
    });
    return NextResponse.json({ ok: true, assetId: asset._id, url: (asset as any).url });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ ok: false, error: error?.message || 'Upload failed' }, { status: 500 });
  }
}



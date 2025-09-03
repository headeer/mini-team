import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN!,
  apiVersion: '2024-01-01',
});

function td(imageUrl?: string, fileUrl?: string, title?: string) {
  return { _type: 'object', title, ...(imageUrl ? { image: { _type: 'image', asset: { _type: 'reference', _ref: imageUrl } } as any } : {}), ...(fileUrl ? { file: { _type: 'file', asset: { _type: 'reference', _ref: fileUrl } } as any } : {}) } as any;
}

// For our use-case we will just set externalUrl pointing to public paths, not upload assets now
function tdExternal(title: string, url: string) {
  return { _type: 'object', title, externalUrl: url } as any;
}

async function run() {
  console.log('🔧 Attaching technical drawings...');

  // 1) Wiertnica – mount systems
  const wiertnica = await client.fetch(`*[_type=='product' && name match 'Wiertnica*napęd*'][0]{_id,name}`);
  if (wiertnica?._id) {
    await client.patch(wiertnica._id).set({
      technicalDrawings: [
        tdExternal('Wahacz – premium', '/images/techniczne/rysunek_techniczny_premium.pdf'),
        tdExternal('Wahacz – gięty', '/images/techniczne/rysunek_techniczny_wahacza_gietego.pdf'),
        tdExternal('Wahacz – kostka', '/images/techniczne/rysunek_techniczny_wahacz_kostka.pdf'),
      ]
    }).commit();
    console.log(`✅ Wiertnica – dodano 3 rysunki`);
  }

  // 2) Grabie – match by name containing 'Grabie' and add PNG+PDF
  const grabie = await client.fetch(`*[_type=='product' && name match 'Grabie*']{_id,name}`);
  for (const p of grabie) {
    const images: any[] = [];
    const lower = String(p.name).toLowerCase();
    if (lower.includes('100') && lower.includes('12')) {
      images.push(tdExternal('Grabie 100/12 PNG', '/images/techniczne/png/grabie_100cm_grubosc_zeba_12mm-1.png'));
      images.push(tdExternal('Grabie 100/12 PDF', '/images/techniczne/grabie_100cm_grubosc_zeba_12mm.pdf'));
    }
    if (lower.includes('100') && lower.includes('15')) {
      images.push(tdExternal('Grabie 100/15 PNG', '/images/techniczne/png/grabie_100cm_grubosc_zeba_15mm-1.png'));
      images.push(tdExternal('Grabie 100/15 PDF', '/images/techniczne/grabie_100cm_grubosc_zeba_15mm.pdf'));
    }
    if (lower.includes('120') && lower.includes('12')) {
      images.push(tdExternal('Grabie 120/12 PNG', '/images/techniczne/png/grabie_120cm_12mm-1.png'));
      images.push(tdExternal('Grabie 120/12 PDF', '/images/techniczne/grabie_120cm_12mm.pdf'));
    }
    if (lower.includes('120') && lower.includes('15')) {
      images.push(tdExternal('Grabie 120/15 PNG', '/images/techniczne/png/grabie_120cm_15mm-1.png'));
      images.push(tdExternal('Grabie 120/15 PDF', '/images/techniczne/grabie_120cm_15mm.pdf'));
    }
    if (images.length) {
      await client.patch(p._id).set({ technicalDrawings: images }).commit();
      console.log(`✅ ${p.name} – dodano rysunki grabie`);
    }
  }

  // 3) Zrywaki – match by name containing 'Zrywak' and add PNG+PDF
  const zrywaki = await client.fetch(`*[_type=='product' && (name match '*Zrywak*' || name match '*ripper*')]{_id,name}`);
  for (const p of zrywaki) {
    const lower = String(p.name).toLowerCase();
    const list: any[] = [];
    if (lower.includes('podwojny') && (lower.includes('2-4') || lower.includes('2–4'))) {
      list.push(tdExternal('Zrywak podwójny 2–4T PNG', '/images/techniczne/zrywaki/rysunek_techniczniczny_zrywak_podwojny_2-4_tony.png'));
      list.push(tdExternal('Zrywak podwójny 2–4T PDF', '/images/techniczne/rysunek_techniczniczny_zrywak_podwojny_2-4_tony.pdf'));
    }
    if (lower.includes('podwojny') && (lower.includes('4-8') || lower.includes('4–8'))) {
      list.push(tdExternal('Zrywak podwójny 4–8T PNG', '/images/techniczne/zrywaki/rysunek_techniczny_zrywak_podwojny_4-8_tony.png'));
      list.push(tdExternal('Zrywak podwójny 4–8T PDF', '/images/techniczne/rysunek_techniczny_zrywak_podwojny_4-8_tony.pdf'));
    }
    if (lower.includes('pojedynczy') && (lower.includes('2-4') || lower.includes('2–4'))) {
      list.push(tdExternal('Zrywak pojedynczy 2–4T PNG', '/images/techniczne/zrywaki/rysunek_techniczny_zrywak_pojedynczy_2-4_tony.png'));
      list.push(tdExternal('Zrywak pojedynczy 2–4T PDF', '/images/techniczne/rysunek_techniczny_zrywak_pojedynczy2-4tony.pdf'));
    }
    if (lower.includes('pojedynczy') && (lower.includes('4-8') || lower.includes('4–8'))) {
      list.push(tdExternal('Zrywak pojedynczy 4–8T PNG', '/images/techniczne/zrywaki/rysunek_techniczny_zrywak_pojedynczy_4-8_tony.png'));
      list.push(tdExternal('Zrywak pojedynczy 4–8T PDF', '/images/techniczne/rysunek_techniczny_zrywak_pojedynczy_4-8_tony.pdf'));
    }
    if (list.length) {
      await client.patch(p._id).set({ technicalDrawings: list }).commit();
      console.log(`✅ ${p.name} – dodano rysunki zrywaki`);
    }
  }

  // 4) Łyżki – kopiace/skarpowe
  const lyzki = await client.fetch(`*[_type=='product' && name match 'Łyżka *']{_id,name}`);
  for (const p of lyzki) {
    const lower = String(p.name).toLowerCase();
    if (lower.includes('skarp')) {
      await client.patch(p._id).set({ technicalDrawings: [
        tdExternal('Łyżka skarpowa – rysunek 1', '/images/rys_techniczne/lyska_skarpowa.png'),
        tdExternal('Łyżka skarpowa – rysunek 2', '/images/rys_techniczne/lyska_skarpowa_2.png'),
        tdExternal('Łyżka skarpowa – hydrauliczna 2.3–3.5', '/images/rys_techniczne/lyzka_hydr_2.3_3.5.png'),
        tdExternal('Łyżka skarpowa – hydrauliczna 2.3–3.0', '/images/rys_techniczne/lyzka_hydr_2.3_3.png'),
      ]}).commit();
      console.log(`✅ ${p.name} – skarpowa`);
    } else if (lower.includes('kopi')) {
      await client.patch(p._id).set({ technicalDrawings: [
        tdExternal('Łyżka kopiąca – rysunek 1', '/images/rys_techniczne/lyzka_1_5-2_3.png'),
        tdExternal('Łyżka kopiąca – rysunek 2', '/images/rys_techniczne/lyzka_1_5-2_3_2.png'),
        tdExternal('Łyżka kopiąca – rysunek 1 (alt)', '/images/rys_techniczne/lyska_1.5_2.3.png'),
        tdExternal('Łyżka kopiąca – rysunek 2 (alt)', '/images/rys_techniczne/lyska_1.5_2.3_2.png'),
      ]}).commit();
      console.log(`✅ ${p.name} – kopiaca`);
    }
  }

  console.log('🎉 Finished attaching technical drawings.');
}

run().catch((e) => { console.error('❌ Error:', e); process.exit(1); });



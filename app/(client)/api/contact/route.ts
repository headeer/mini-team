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


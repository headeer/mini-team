import { NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

export const dynamic = "force-dynamic";

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
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    // Upload images to Sanity first
    const images: any[] = [];
    const files = formData.getAll("images");
    for (const file of files) {
      if (file instanceof File) {
        const typeOk = /image\/(png|jpe?g|webp)/i.test(file.type);
        const sizeOk = file.size <= 5 * 1024 * 1024; // 5MB
        if (!typeOk || !sizeOk) continue;
        const asset = await backendClient.assets.upload("image", file as unknown as Blob, {
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

    return NextResponse.json({ ok: true, id: created._id });
  } catch (error) {
    console.error("FitCheck error:", error);
    return NextResponse.json({ ok: false, error: "Failed to submit fit check" }, { status: 500 });
  }
}




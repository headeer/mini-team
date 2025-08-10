import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/lib/live";
import { MY_ORDERS_QUERY } from "@/sanity/queries/query";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { data } = await sanityFetch({ query: MY_ORDERS_QUERY, params: { userId } });
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}


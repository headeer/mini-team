import { NextResponse } from "next/server";
// import { sanityFetch } from "@/sanity/lib/live";
// import { MY_ORDERS_QUERY } from "@/sanity/queries/query";
// import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  // Temporarily disable Clerk authentication
  // const user = await currentUser();
  // const userId = user?.id;
  // if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  // For now, return empty orders until Clerk is properly configured
  return NextResponse.json({ data: [] });
  
  // try {
  //   const { data } = await sanityFetch({ query: MY_ORDERS_QUERY, params: { userId } });
  //   return NextResponse.json({ data });
  // } catch (error) {
  //   return NextResponse.json({ error: String(error) }, { status: 500 });
  // }
}


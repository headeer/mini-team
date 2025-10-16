import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET() {
  try {
    // First, check if the "części" category exists
    const category = await client.fetch(`
      *[_type == "category" && slug.current == "czesci"][0]
    `);

    if (!category) {
      console.log("Category 'części' not found in Sanity, returning empty array");
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        source: "sanity",
        message: "Category 'części' not found"
      });
    }

    // Fetch from Sanity - only products from "części" category
    const parts = await client.fetch(`
      *[_type == "product" && references("${category._id}")] {
        _id,
        name,
        description,
        price,
        originalPrice,
        status,
        condition,
        category->title,
        slug,
        image
      }
    `);

    // Always return the actual data from Sanity, even if empty
    return NextResponse.json({
      success: true,
      data: parts || [],
      count: parts ? parts.length : 0,
      source: "sanity"
    });
  } catch (error) {
    console.error("Error fetching parts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch parts" },
      { status: 500 }
    );
  }
}

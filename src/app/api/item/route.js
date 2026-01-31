import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Force Next.js not to cache this API

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function GET() {
  // PDF Page 16: Headers to prevent caching stale data
  const headers = {
    ...corsHeaders,
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");
    const result = await db.collection("item").find({}).toArray();

    return NextResponse.json(result, { headers });
  } catch (exception) {
    return NextResponse.json(
      { message: exception.toString() },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const client = await getClientPromise();
    const db = client.db("wad-01");

    // PDF Page 8: Map input fields and add ACTIVE status
    const newItem = {
      itemName: data.name,
      itemCategory: data.category,
      itemPrice: data.price,
      status: "ACTIVE", // Required for video match
    };

    const result = await db.collection("item").insertOne(newItem);

    return NextResponse.json(
      { id: result.insertedId },
      { status: 201, headers: corsHeaders }
    );
  } catch (exception) {
    return NextResponse.json(
      { message: exception.toString() },
      { status: 500, headers: corsHeaders }
    );
  }
}

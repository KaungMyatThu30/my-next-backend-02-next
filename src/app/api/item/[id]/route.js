import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Fix CORS and Method errors
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function GET(req, { params }) {
  const { id } = await params;
  if (!ObjectId.isValid(id))
    return NextResponse.json(
      { message: "Invalid ID" },
      { status: 400, headers: corsHeaders }
    );

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");
    const result = await db
      .collection("item")
      .findOne({ _id: new ObjectId(id) });
    return NextResponse.json(result, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: error.toString() },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PATCH(req, { params }) {
  const { id } = await params;
  if (!ObjectId.isValid(id))
    return NextResponse.json(
      { message: "Invalid ID" },
      { status: 400, headers: corsHeaders }
    );

  try {
    const data = await req.json();
    const client = await getClientPromise();
    const db = client.db("wad-01");

    const partialUpdate = {};
    if (data.name) partialUpdate.itemName = data.name;
    if (data.category) partialUpdate.itemCategory = data.category;
    if (data.price) partialUpdate.itemPrice = data.price;

    const result = await db
      .collection("item")
      .updateOne({ _id: new ObjectId(id) }, { $set: partialUpdate });

    return NextResponse.json(result, { status: 200, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: error.toString() },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  if (!ObjectId.isValid(id))
    return NextResponse.json(
      { message: "Invalid ID" },
      { status: 400, headers: corsHeaders }
    );

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");
    const result = await db
      .collection("item")
      .deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json(result, { status: 200, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: error.toString() },
      { status: 500, headers: corsHeaders }
    );
  }
}
